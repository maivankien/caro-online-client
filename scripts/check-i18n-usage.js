import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fileCache = new Map()

const IGNORE_PATTERNS = [
    /\$\{[^}]+\}/,  // Template literals với biến
    /API_ENDPOINTS/,  // API endpoints
    /^https?:\/\//,  // URLs
    /^\/[^.]/,  // Routes
    /^[A-Z_]+$/,  // Constants (UPPER_CASE)
    /^[a-z]+\.[a-z]+\.[a-z]+\.$/,  // Incomplete keys like "roomList.status."
    /^\/$/,  // Single slash
    /^[a-z]+\.[a-z]+\.[a-z]+\.[a-z]+\.$/,  // More incomplete patterns
]

const IGNORE_FILES = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage',
    'test',
    '__tests__',
    '.test.',
    '.spec.'
]

const SCAN_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']

function getAllTranslationKeys(obj, prefix = '') {
    const keys = []
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            keys.push(...getAllTranslationKeys(value, fullKey))
        } else {
            keys.push(fullKey)
        }
    }
    return keys
}

function shouldIgnoreFile(filePath) {
    return IGNORE_FILES.some(pattern =>
        filePath.includes(pattern) ||
        filePath.match(new RegExp(pattern))
    )
}

function shouldIgnoreKey(key) {
    // Bỏ qua key rỗng hoặc chỉ có dấu chấm
    if (!key || key.trim() === '' || key === '.' || key.endsWith('.')) {
        return true
    }

    return IGNORE_PATTERNS.some(pattern => pattern.test(key))
}

function readFileCached(filePath) {
    if (fileCache.has(filePath)) {
        return fileCache.get(filePath)
    }

    const content = fs.readFileSync(filePath, 'utf8')
    fileCache.set(filePath, content)
    return content
}

function findUsedKeys(srcDir) {
    const usedKeys = new Set()
    const usedKeysWithFiles = new Map()
    const dynamicKeyPatterns = new Map() // Track dynamic key patterns

    function scanDirectory(dir) {
        const files = fs.readdirSync(dir, { withFileTypes: true })

        for (const file of files) {
            const filePath = path.join(dir, file.name)

            if (file.isDirectory()) {
                if (!shouldIgnoreFile(filePath)) {
                    scanDirectory(filePath)
                }
            } else if (file.isFile()) {
                const ext = path.extname(file.name)
                if (SCAN_EXTENSIONS.includes(ext) && !shouldIgnoreFile(filePath)) {
                    scanFile(filePath)
                }
            }
        }
    }

    function scanFile(filePath) {
        const content = readFileCached(filePath)

        // 1. Static string literals: t('key') or t("key")
        const stringLiteralMatches = content.match(/t\(['"]([^'"]+)['"]\)/g)
        if (stringLiteralMatches) {
            stringLiteralMatches.forEach(match => {
                const key = match.match(/t\(['"]([^'"]+)['"]\)/)[1]
                if (!shouldIgnoreKey(key)) {
                    usedKeys.add(key)
                    if (!usedKeysWithFiles.has(key)) {
                        usedKeysWithFiles.set(key, [])
                    }
                    usedKeysWithFiles.get(key).push(filePath)
                }
            })
        }

        // 2. Interpolation: t('key', { param: value })
        const interpolationMatches = content.match(/t\(['"]([^'"]+)['"],\s*\{[^}]*\}\)/g)
        if (interpolationMatches) {
            interpolationMatches.forEach(match => {
                const key = match.match(/t\(['"]([^'"]+)['"],\s*\{[^}]*\}\)/)[1]
                if (!shouldIgnoreKey(key)) {
                    usedKeys.add(key)
                    if (!usedKeysWithFiles.has(key)) {
                        usedKeysWithFiles.set(key, [])
                    }
                    usedKeysWithFiles.get(key).push(filePath)
                }
            })
        }

        // 3. Template literals: t(`key.${variable}`)
        const templateLiteralMatches = content.match(/t\(`([^`]+)`\)/g)
        if (templateLiteralMatches) {
            templateLiteralMatches.forEach(match => {
                const template = match.match(/t\(`([^`]+)`\)/)[1]
                const dynamicPattern = extractDynamicPattern(template)
                
                if (dynamicPattern) {
                    if (!dynamicKeyPatterns.has(dynamicPattern.pattern)) {
                        dynamicKeyPatterns.set(dynamicPattern.pattern, {
                            files: [],
                            examples: new Set()
                        })
                    }
                    dynamicKeyPatterns.get(dynamicPattern.pattern).files.push(filePath)
                    dynamicKeyPatterns.get(dynamicPattern.pattern).examples.add(template)
                }
            })
        }
    }

    // Extract dynamic pattern from template literal
    function extractDynamicPattern(template) {
        // Convert t(`roomList.status.${room.status}`) to pattern "roomList.status.*"
        const pattern = template.replace(/\$\{[^}]+\}/g, '*')
        
        // Only process if it looks like a valid key pattern
        if (pattern.includes('.') && !pattern.includes('API_') && !pattern.includes('http')) {
            return {
                pattern: pattern,
                original: template
            }
        }
        return null
    }

    scanDirectory(srcDir)
    return { usedKeys, usedKeysWithFiles, dynamicKeyPatterns }
}

function loadTranslations(localesDir) {
    const translations = {}
    const languages = ['en', 'vi']

    for (const lang of languages) {
        try {
            const filePath = path.join(localesDir, lang, 'common.json')
            const content = readFileCached(filePath)
            translations[lang] = JSON.parse(content)
        } catch (error) {
            console.warn(`⚠️  Cannot load ${lang} translations: ${error.message}`)
            translations[lang] = {}
        }
    }

    return translations
}

function analyzeDynamicPatterns(dynamicKeyPatterns, allEnKeys, allViKeys) {
    const analysis = {
        validPatterns: [],
        missingPatterns: [],
        unusedPatterns: []
    }

    for (const [pattern, data] of dynamicKeyPatterns) {
        // Convert pattern like "roomList.status.*" to regex
        const patternRegex = new RegExp('^' + pattern.replace(/\*/g, '[^.]+') + '$')
        
        // Find matching keys in translations
        const matchingEnKeys = allEnKeys.filter(key => patternRegex.test(key))
        const matchingViKeys = allViKeys.filter(key => patternRegex.test(key))
        
        if (matchingEnKeys.length > 0 || matchingViKeys.length > 0) {
            analysis.validPatterns.push({
                pattern,
                examples: Array.from(data.examples),
                files: data.files,
                matchingEnKeys,
                matchingViKeys
            })
        } else {
            analysis.missingPatterns.push({
                pattern,
                examples: Array.from(data.examples),
                files: data.files
            })
        }
    }

    return analysis
}

function checkI18nUsage() {
    const projectRoot = path.join(__dirname, '..')
    const srcDir = path.join(projectRoot, 'src')
    const localesDir = path.join(srcDir, 'locales')

    console.log('�� Scanning for i18n usage...\n')

    // Load translations
    const translations = loadTranslations(localesDir)
    const allEnKeys = getAllTranslationKeys(translations.en)
    const allViKeys = getAllTranslationKeys(translations.vi)

    // Find used keys
    const { usedKeys, usedKeysWithFiles, dynamicKeyPatterns } = findUsedKeys(srcDir)

    // Check dynamic patterns against translation keys
    const dynamicPatternAnalysis = analyzeDynamicPatterns(dynamicKeyPatterns, allEnKeys, allViKeys)
    
    // Get all keys that are covered by dynamic patterns
    const dynamicCoveredKeys = new Set()
    dynamicPatternAnalysis.validPatterns.forEach(pattern => {
        pattern.matchingEnKeys.forEach(key => dynamicCoveredKeys.add(key))
        pattern.matchingViKeys.forEach(key => dynamicCoveredKeys.add(key))
    })

    // Calculate statistics
    const unusedEnKeys = allEnKeys.filter(key => !usedKeys.has(key) && !dynamicCoveredKeys.has(key))
    const unusedViKeys = allViKeys.filter(key => !usedKeys.has(key) && !dynamicCoveredKeys.has(key))
    const missingEnKeys = Array.from(usedKeys).filter(key => !allEnKeys.includes(key))
    const missingViKeys = Array.from(usedKeys).filter(key => !allViKeys.includes(key))
    const enOnlyKeys = allEnKeys.filter(key => !allViKeys.includes(key))
    const viOnlyKeys = allViKeys.filter(key => !allEnKeys.includes(key))

    // Display results
    console.log('📊 I18n Usage Analysis\n')
    console.log('�� Statistics:')
    console.log(`   Total EN keys: ${allEnKeys.length}`)
    console.log(`   Total VI keys: ${allViKeys.length}`)
    console.log(`   Used static keys: ${usedKeys.size}`)
    console.log(`   Dynamic patterns: ${dynamicKeyPatterns.size}`)
    console.log(`   Unused EN keys: ${unusedEnKeys.length}`)
    console.log(`   Unused VI keys: ${unusedViKeys.length}`)
    console.log(`   Missing EN keys: ${missingEnKeys.length}`)
    console.log(`   Missing VI keys: ${missingViKeys.length}`)
    console.log(`   EN-only keys: ${enOnlyKeys.length}`)
    console.log(`   VI-only keys: ${viOnlyKeys.length}\n`)

    // Show unused keys
    if (unusedEnKeys.length > 0) {
        console.log('❌ Unused EN translation keys:')
        unusedEnKeys.forEach(key => console.log(`   - ${key}`))
        console.log()
    }

    if (unusedViKeys.length > 0) {
        console.log('❌ Unused VI translation keys:')
        unusedViKeys.forEach(key => console.log(`   - ${key}`))
        console.log()
    }

    // Show missing keys with file locations
    if (missingEnKeys.length > 0) {
        console.log('⚠️  Missing EN translation keys:')
        missingEnKeys.forEach(key => {
            console.log(`   - ${key}`)
            const files = usedKeysWithFiles.get(key) || []
            files.forEach(file => {
                const relativePath = path.relative(projectRoot, file)
                console.log(`     📁 ${relativePath}`)
            })
        })
        console.log()
    }

    if (missingViKeys.length > 0) {
        console.log('⚠️  Missing VI translation keys:')
        missingViKeys.forEach(key => {
            console.log(`   - ${key}`)
            const files = usedKeysWithFiles.get(key) || []
            files.forEach(file => {
                const relativePath = path.relative(projectRoot, file)
                console.log(`     📁 ${relativePath}`)
            })
        })
        console.log()
    }

    // Show keys only in one language
    if (enOnlyKeys.length > 0) {
        console.log('�� Keys only in EN:')
        enOnlyKeys.forEach(key => console.log(`   - ${key}`))
        console.log()
    }

    if (viOnlyKeys.length > 0) {
        console.log('�� Keys only in VI:')
        viOnlyKeys.forEach(key => console.log(`   - ${key}`))
        console.log()
    }

    // Show dynamic patterns analysis
    if (dynamicPatternAnalysis.validPatterns.length > 0) {
        console.log('✅ Valid dynamic patterns:')
        dynamicPatternAnalysis.validPatterns.forEach(pattern => {
            console.log(`   - ${pattern.pattern}`)
            console.log(`     Examples: ${pattern.examples.join(', ')}`)
            console.log(`     Matching EN keys: ${pattern.matchingEnKeys.length > 0 ? pattern.matchingEnKeys.join(', ') : 'None'}`)
            console.log(`     Matching VI keys: ${pattern.matchingViKeys.length > 0 ? pattern.matchingViKeys.join(', ') : 'None'}`)
            pattern.files.forEach(file => {
                const relativePath = path.relative(projectRoot, file)
                console.log(`     📁 ${relativePath}`)
            })
            console.log()
        })
    }

    if (dynamicPatternAnalysis.missingPatterns.length > 0) {
        console.log('⚠️  Missing dynamic patterns:')
        dynamicPatternAnalysis.missingPatterns.forEach(pattern => {
            console.log(`   - ${pattern.pattern}`)
            console.log(`     Examples: ${pattern.examples.join(', ')}`)
            pattern.files.forEach(file => {
                const relativePath = path.relative(projectRoot, file)
                console.log(`     📁 ${relativePath}`)
            })
            console.log()
        })
    }

    const totalIssues = unusedEnKeys.length + unusedViKeys.length + missingEnKeys.length + missingViKeys.length + dynamicPatternAnalysis.missingPatterns.length
    if (totalIssues === 0) {
        console.log('✅ All translation keys are properly configured!')
    } else {
        console.log(`⚠️  Found ${totalIssues} issues that need attention.`)
    }

    fileCache.clear()
}

checkI18nUsage()