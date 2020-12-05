import { PedidoDetalle } from './pedido-detalle-model';

export class Pedido {
    docID?: string;
    usuarioDocID?: string;
    usuarioNombre?: string;
    mesaDocID?: string;
    mesaNro?: string;
    fechaInicio?: string;
    fechaFin?: string;
    estado?: string;
    importeTotal?: string;
    detallePedido?: PedidoDetalle[];

    constructor() {
        this.detallePedido = [];
    }
}
