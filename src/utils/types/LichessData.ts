// Custom data type for handling Lichess data
export interface LichessData {
    status: {
        id: string,
        online: boolean
    },
    account: {
        count: {
            all: string,
            win: string,
            loss: string,
            draw: string
        }
    }
}