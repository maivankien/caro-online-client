import RoomCard from './RoomCard'
import { useRooms } from '../hooks/useRooms'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { Card, Button, Pagination, Row, Col, Typography } from 'antd'

const { Title, Text } = Typography

const RoomList = () => {
    const { t } = useTranslation()
    const {
        rooms,
        total,
        currentPage,
        pageSize,
        isLoading,
        error,
        refetch,
        joinRoom,
        handlePageChange,
        isJoining,
        joinError
    } = useRooms()

    const navigate = useNavigate()

    const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date())

    useEffect(() => {
        setLastFetchTime(new Date())
    }, [rooms])

    const handleJoinRoom = async (roomId: string) => {
        await joinRoom(roomId)
        navigate(`/game/${roomId}`)
    }

    const handleRefresh = () => {
        refetch()
    }

    if (error) {
        return (
            <div className="room-list">
                <div className="room-list-header">
                    <Title level={2}>{t('roomList.title')}</Title>
                    <Button type="primary" onClick={handleRefresh}>
                        {t('roomList.retry')}
                    </Button>
                </div>
                <div className="empty-state">
                    <Text type="danger">
                        {error.message || t('toast.networkError')}
                    </Text>
                </div>
            </div>
        )
    }

    return (
        <div className="room-list">
            <div className="room-list-header">
                <Title level={2}>
                    {t('roomList.title')}
                    <small style={{
                        fontSize: '12px',
                        color: '#999',
                        marginLeft: '8px',
                        fontWeight: 'normal'
                    }}>
                        ({t('roomList.autoRefresh')} • {t('roomList.lastUpdated')}: {lastFetchTime.toLocaleTimeString()})
                    </small>
                </Title>
                <Button type="primary" onClick={handleRefresh} loading={isLoading}>
                    {t('roomList.refresh')}
                </Button>
            </div>

            <Row gutter={[16, 16]} className="room-grid">
                {isLoading && (
                    Array.from({ length: pageSize }, (_, index) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={index}>
                            <Card loading={true} />
                        </Col>
                    ))
                )}

                {!isLoading && rooms.length > 0 && (
                    rooms.map((room) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={room.id}>
                            <RoomCard
                                room={room}
                                onJoinRoom={handleJoinRoom}
                                isJoining={isJoining}
                            />
                        </Col>
                    ))
                )}

                {!isLoading && rooms.length === 0 && (
                    <Col span={24}>
                        <div className="empty-state">
                            <Text>{t('roomList.noRooms')}</Text>
                        </div>
                    </Col>
                )}
            </Row>

            {joinError && (
                <div className="error-message">
                    <Text type="danger">
                        {joinError.message || t('toast.error')}
                    </Text>
                </div>
            )}

            {total > pageSize && (
                <div className="pagination-container">
                    <Pagination
                        current={currentPage}
                        total={total}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} ${t('roomList.title').toLowerCase()}`
                        }
                    />
                </div>
            )}
        </div>
    )
}

export default RoomList 