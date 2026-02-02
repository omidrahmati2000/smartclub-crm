'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Badge,
    Button,
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@smartclub/ui'
import { MoreVertical, UserMinus, ShieldCheck } from 'lucide-react'

interface Participant {
    id: string
    name: string
    email: string
    phone: string
    seed?: number
    paymentStatus: 'paid' | 'pending'
    registeredAt: string
}

interface ParticipantListProps {
    participants: Participant[]
    onRemove: (id: string) => void
    onUpdateStatus: (id: string, status: 'paid' | 'pending') => void
}

export function ParticipantList({ participants, onRemove, onUpdateStatus }: ParticipantListProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Seed</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Registered At</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {participants.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell className="font-mono">
                                {p.seed ? (
                                    <Badge variant="outline" className="font-bold text-primary">#{p.seed}</Badge>
                                ) : '-'}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{p.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{p.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col text-xs text-muted-foreground">
                                    <span>{p.email}</span>
                                    <span>{p.phone}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {new Date(p.registeredAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={p.paymentStatus === 'paid' ? 'default' : 'secondary'}
                                    className="cursor-pointer"
                                    onClick={() => onUpdateStatus(p.id, p.paymentStatus === 'paid' ? 'pending' : 'paid')}
                                >
                                    {p.paymentStatus.toUpperCase()}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => onRemove(p.id)}>
                                        <UserMinus className="h-4 w-4 text-destructive" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {participants.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No participants registered yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
