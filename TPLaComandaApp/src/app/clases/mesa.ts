export interface IMesa {
    codigoqr: string,
    cliente: string,
    estado: string
}

export interface IMesaID extends IMesa {
    id: string;
}