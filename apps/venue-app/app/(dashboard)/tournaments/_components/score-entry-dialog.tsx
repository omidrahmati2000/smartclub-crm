'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Button,
    Input,
    Label
} from '@smartclub/ui'
import { useState } from 'react'

interface ScoreEntryDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (score1: number, score2: number) => void
    team1Name: string
    team2Name: string
    initialScore1?: number
    initialScore2?: number
    matchId?: string
}

export function ScoreEntryDialog({
    isOpen,
    onClose,
    onSave,
    team1Name,
    team2Name,
    initialScore1 = 0,
    initialScore2 = 0,
    matchId
}: ScoreEntryDialogProps) {
    const [s1, setS1] = useState(initialScore1)
    const [s2, setS2] = useState(initialScore2)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enter Match Score</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 items-center gap-4 text-center">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold truncate block">{team1Name}</Label>
                            <Input
                                type="number"
                                className="text-center text-4xl h-20 font-mono"
                                value={s1}
                                onChange={(e) => setS1(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold truncate block">{team2Name}</Label>
                            <Input
                                type="number"
                                className="text-center text-4xl h-20 font-mono"
                                value={s2}
                                onChange={(e) => setS2(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    {/* Public Live View Link */}
                    {matchId && (
                        <Button variant="secondary" onClick={() => window.open(`http://localhost:3000/live/${matchId}`, '_blank')}>
                            Open Scoreboard
                        </Button>
                    )}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={() => onSave(s1, s2)}>Save Results</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
