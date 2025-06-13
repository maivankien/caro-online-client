import { useEffect, useState } from 'react'
import { Card, Button, Pagination, Row, Col, Typography } from 'antd'
import { gameApi } from '../services/gameApi'
import type { IRoom } from '../types'
import RoomCard from './RoomCard'
import { useTranslation } from '@/hooks/useTranslation'

const { Title, Text } = Typography

const RoomList = () => {
    const { t } = useTranslation()
    const [rooms, setRooms] = useState<IRoom[]>([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [pageSize] = useState(8) // 8 rooms per page

    const fetchRooms = async (page: number = 1) => {
        try {
            setLoading(true)
            const response = await gameApi.getRooms({ page, limit: pageSize })

            setRooms(response.data.rooms)
            setTotal(response.data.total)
        } catch (error) {
            console.error('Error fetching rooms:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRooms(currentPage)
    }, [currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleJoinRoom = (roomId: string) => {
        // Implement join room logic
        console.log('Joining room:', roomId)
    }

    return (
        <div className="room-list">
            <div className="room-list-header">
                <Title level={2}>{t('roomList.title')}</Title>
                <Button type="primary" onClick={() => fetchRooms(currentPage)}>
                    {t('roomList.refresh')}
                </Button>
            </div>

            <Row gutter={[16, 16]} className="room-grid">
                {loading && (
                    Array.from({ length: pageSize }, (_, index) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={index}>
                            <Card loading={true} />
                        </Col>
                    ))
                )}

                {!loading && rooms.length > 0 && (
                    rooms.map((room) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={room.id}>
                            <RoomCard room={room} onJoinRoom={handleJoinRoom} />
                        </Col>
                    ))
                )}

                {!loading && rooms.length === 0 && (
                    <Col span={24}>
                        <div className="empty-state">
                            <Text>{t('roomList.noRooms')}</Text>
                        </div>
                    </Col>
                )}
            </Row>

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