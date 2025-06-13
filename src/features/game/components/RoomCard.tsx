import { Card, Tag, Button, Space, Typography } from 'antd'
import { LockOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons'
import type { IRoom } from '../types'
import { useTranslation } from '@/hooks/useTranslation'

const { Title, Text } = Typography

interface IRoomCardProps {
    room: IRoom
    onJoinRoom: (roomId: string) => void
    isJoining?: boolean
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'waiting':
            return 'green'
        case 'playing':
            return 'blue'
        case 'finished':
            return 'red'
        default:
            return 'default'
    }
}

const RoomCard = ({ room, onJoinRoom, isJoining = false }: IRoomCardProps) => {
    const { t } = useTranslation()

    const isDisabled = room.status !== 'waiting' || room.currentPlayers >= room.maxPlayers || isJoining

    const getButtonText = () => {
        if (isJoining) {
            return t('roomList.joining')
        }
        if (room.currentPlayers >= room.maxPlayers) {
            return t('roomList.fullBtn')
        }
        return t('roomList.joinBtn')
    }

    return (
        <Card
            className="room-card"
            hoverable
            actions={[
                <Button
                    key="join"
                    type="primary"
                    disabled={isDisabled}
                    loading={isJoining}
                    onClick={() => onJoinRoom(room.id)}
                >
                    {getButtonText()}
                </Button>
            ]}
        >
            <div className="room-card-header">
                <Space>
                    <Title level={4} style={{ margin: 0 }}>
                        {room.name}
                    </Title>
                    {room.hasPassword && <LockOutlined style={{ color: '#faad14' }} />}
                </Space>
                <Tag color={getStatusColor(room.status)}>
                    {t(`roomList.status.${room.status}`)}
                </Tag>
            </div>

            <div className="room-card-content">
                <div className="room-info-item">
                    <UserOutlined />
                    <Text strong>{t('roomList.createdBy')} </Text>
                    <Text>{room.host.name}</Text>
                </div>

                <div className="room-info-item">
                    <UserOutlined />
                    <Text strong>{t('roomList.players')} </Text>
                    <Text>{room.currentPlayers}/{room.maxPlayers}</Text>
                </div>

                <div className="room-info-item">
                    <AppstoreOutlined />
                    <Text strong>{t('roomList.boardSize')} </Text>
                    <Text>{t('roomList.boardSizeFormat', { size: room.boardSize })}</Text>
                </div>

                <div className="room-info-item">
                    <AppstoreOutlined />
                    <Text strong>{t('roomList.winCondition')} </Text>
                    <Text>{t('roomList.winConditionCount', { count: room.winCondition })}</Text>
                </div>
            </div>
        </Card>
    )
}

export default RoomCard 