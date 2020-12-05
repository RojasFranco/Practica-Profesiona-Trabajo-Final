export interface IClienteASupervisar {
    nombre: string;
    email: string;
    estado: string;
}

export interface IClienteASupervisarUID extends IClienteASupervisar {
    uid;
}

export interface IClienteEspera {
    nombre: string;
    role: string;
}

export interface IClienteEsperaId extends IClienteEspera {
    uid: string;
}