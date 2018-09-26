export const createHttpExceptionBody = (message: any,
                                        error: string,
                                        status: number) => (message ? {status, error, message} : {status, error});
