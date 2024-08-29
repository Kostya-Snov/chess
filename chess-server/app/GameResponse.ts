export type SuccessGameResponse = "Ok";

export const successGameResponse: SuccessGameResponse = "Ok";


type MutableGameErrorResponse = {
    description: string;
    details?: unknown;
};

export type GameErrorResponse = Readonly<MutableGameErrorResponse>;

export const asErrorResponse = (
    description: string,
    ...detailsRest: [unknown?]
): GameErrorResponse => {
    const response: MutableGameErrorResponse = { description };
    if (detailsRest.length !== 0) {
        response.details = detailsRest[0];
    }
    return response;
};


export type GameResponse = SuccessGameResponse | GameErrorResponse;
