import React, { useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';

const nodeTypes = {
    // Define custom nodes if necessary
};

const initialNodes = [
    { id: '1', data: { label: 'User Management' }, position: { x: 50, y: 0 } },
    { id: '2', data: { label: 'Teams' }, position: { x: 200, y: 0 } },
    { id: '3', data: { label: 'Jobs' }, position: { x: 350, y: 0 } },
    { id: '4', data: { label: 'Time' }, position: { x: 500, y: 0 } },
    { id: '5', data: { label: 'Purchase Orders' }, position: { x: 650, y: 0 } },
    { id: '6', data: { label: 'Time Approval' }, position: { x: 800, y: 0 } },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e4-5', source: '4', target: '5' },
    { id: 'e5-6', source: '5', target: '6' },
];

// Configuración inicial de accesos para todos los componentes
const defaultAccess = ['foreman', 'admin', 'worker'];

// Configuración de acceso para cada componente
const componentAccess = {
    userManagement: { access: ['admin', 'superadmin'] }, // Acceso específico para User Management
    teams: { access: ['foreman', 'admin'] }, // Acceso específico para Teams
    jobs: { access: defaultAccess },
    time: { access: defaultAccess },
    purchaseOrders: { access: defaultAccess },
    timeApproval: { access: ['foreman', 'admin'] }, // Acceso específico para Time Approval
};

// Modificar accesos específicos
componentAccess.userManagement.access = ['admin', 'superadmin']; // Específico para User Management
componentAccess.teams.access = ['foreman', 'admin']; // Específico para Teams
componentAccess.time.access = defaultAccess; // Acceso por defecto
componentAccess.time.purchaseOrders = ['foreman', 'admin'];; // Acceso por defecto
// Continúa modificando según lo que necesites

const Diagram = () => {
    const [modalInfo, setModalInfo] = useState(null);

    // Mapeo para convertir el nombre de nodo a la clave correcta en componentAccess
    const labelToKeyMap = {
        'User Management': 'userManagement',
        'Teams': 'teams',
        'Jobs': 'jobs',
        'Time': 'time',
        'Purchase Orders': 'purchaseOrders',
        'Time Approval': 'timeApproval',
    };

    const handleNodeClick = (event, node) => {
        // Obtener acceso basado en el mapeo del nombre del nodo
        const key = labelToKeyMap[node.data.label] || '';
        const accessInfo = componentAccess[key] || { access: [] };

        setModalInfo({
            title: node.data.label,
            requirements: getRequirements(node.id),
            information: getInformation(node.id),
            access: accessInfo.access,
        });
    };

    const getRequirements = (nodeId) => {
        switch (nodeId) {
            case '1': // Nodo de User Management
                return 'Ser admin o foreman.';
            case '2': // Nodo de Teams
                return 'Requiere User Management.';
            case '3': // Nodo de Jobs
                return 'User Management, importar las SOM y el bugget para las PML y la SML, Teams, Vendors, Contractors.';
            case '4': // Nodo de Time
                return 'Nombre del job (Jobs) y ubicación.';
            case '5': // Nodo de Purchase Orders
                return 'Requiere el componente de Jobs y la acción de importar el PML del(bugget) y un vendedor.';
            case '6': // Nodo de Time Approval
                return 'User Management, Jobs y Clock-in (Time).';
            default:
                return `Requisitos para el nodo ${nodeId}`;
        }
    };

    const getInformation = (nodeId) => {
        switch (nodeId) {
            case '1': // Nodo de User Management
                return 'Nombre de tus trabajadores, email, contraseña y rol (foreman, admin, worker, superadmin).';
            case '2': // Nodo de Teams
                return 'Nombres de los integrantes del team, nombre del team y alguna notificación opcional.';
            case '3': // Nodo de Jobs
                return 'Necesitas saber todo el material, servicios y los pagos por etapa del job, junto con todos los equipos, ubicaciones, dimensiones, fechas, contratistas, vendedores, nombre del dueño, y quiénes serán los foremans.';
            case '4': // Nodo de Time
                return 'Necesitas saber el nombre del trabajo para verificar si estás en esa ubicación para poder hacer clock-in; el job necesita una ubicación.';
            case '5': // Nodo de Purchase Orders
                return 'Necesitas saber la lista de productos para trabajar, incluyendo nombre, cantidad, y nivel con su sección correspondiente.';
            case '6': // Nodo de Time Approval
                return 'El nombre del usuario, el nombre del job y la fecha para poder filtrar y facilitar la búsqueda.';
            default:
                return `Información necesaria para el nodo ${nodeId}`;
        }
    };

    const getDescription = (nodeLabel) => {
        switch (nodeLabel) {
            case 'User Management':
                return 'Aquí podrás agregar a todos tus trabajadores y asignarles roles para la creación de un job y el manejo de la aplicación.';
            case 'Teams':
                return 'Aquí creas los teams y separas a tus equipos para posteriormente agregarlos a un job.';
            case 'Jobs':
                return 'Aquí puedes crear un job, donde tendrás toda su información desde las dimensiones hasta los budgets y donde tus equipos trabajarán y estará la ubicación del job para que así puedan hacer clock-in.';
            case 'Time':
                return 'Necesitas saber el nombre del trabajo para poder saber si estás en esa ubicación para hacer clock-in; nótese que el job necesita una ubicación.';
            case 'Purchase Orders':
                return 'En esta página puedes pedir los materiales para comenzar a trabajar, ya sea desde la PML donde previamente en el componente de Jobs lo habías importado en el botón de bugget, o nuevos si calculaste mal la cantidad de material necesario o cualquier otra razón.';
            case 'Time Approval':
                return 'Esta página sirve para aprobar el tiempo de los trabajadores, verificando que el tiempo concuerde con el que el foreman o supervisor en cuestión aprueba.';
            default:
                return `Descripción para ${nodeLabel}`;
        }
    };

    return (
        <div style={{ height: 400 }}>
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
            {modalInfo && (
                <Modal onClose={() => setModalInfo(null)}>
                    <h2>{modalInfo.title}</h2>
                    <p><strong>Requerimientos:</strong> {modalInfo.requirements}</p>
                    <p><strong>Descripción:</strong> {getDescription(modalInfo.title)}</p>
                    <p><strong>Información Necesaria:</strong> {modalInfo.information}</p>
                    <p><strong>Acceso:</strong> {modalInfo.access.join(', ')}</p> {/* Mostrar accesos */}
                </Modal>
            )}
        </div>
    );
};

const Modal = ({ children, onClose }) => (
    <div className="modal">
        <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
            {children}
        </div>
    </div>
);

export default Diagram;
