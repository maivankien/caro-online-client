import { Modal, Form, Input, Button, Typography } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useTranslation } from '@/hooks/useTranslation'

const { Text } = Typography

interface IPasswordModalProps {
    visible: boolean
    roomName: string
    onConfirm: (password: string) => void
    onCancel: () => void
    loading?: boolean
}

const PasswordModal = ({ 
    visible, 
    roomName, 
    onConfirm, 
    onCancel, 
    loading = false 
}: IPasswordModalProps) => {
    const { t } = useTranslation()
    const [form] = Form.useForm()

    const handleSubmit = (values: { password: string }) => {
        onConfirm(values.password)
    }

    const handleCancel = () => {
        form.resetFields()
        onCancel()
    }

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LockOutlined style={{ color: '#faad14' }} />
                    <span>{t('roomList.passwordRequired')}</span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <div style={{ marginBottom: '16px' }}>
                <Text>
                    {t('roomList.passwordPrompt', { roomName })}
                </Text>
            </div>
            
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    name="password"
                    label={t('roomList.password')}
                    rules={[
                        { required: true, message: t('roomList.passwordRequired') }
                    ]}
                >
                    <Input.Password
                        placeholder={t('roomList.passwordPlaceholder')}
                        autoFocus
                    />
                </Form.Item>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '8px',
                    marginTop: '16px'
                }}>
                    <Button onClick={handleCancel}>
                        {t('common.cancel')}
                    </Button>
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={loading}
                    >
                        {t('roomList.joinBtn')}
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default PasswordModal
