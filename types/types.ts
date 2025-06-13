
export type TenseType = {
    tense: 'present' | 'aorist' | 'imperfect' | 'future'
}

export type GameScreenType = {
    verbIndex: number
} & TenseType