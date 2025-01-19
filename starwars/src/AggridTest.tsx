import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
// import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ClientSideRowModelModule } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

interface RowData {
    athlete: string;
    age: number;
    country: string;
    year: number;
    date: string;
    sport: string;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
}

const AggridTest: React.FC = () => {
    const [columnDefs] = useState([
        { field: 'athlete' },
        { field: 'age', maxWidth: 100 },
        { field: 'country' },
        { field: 'year', maxWidth: 100 },
        { field: 'date' },
        { field: 'sport' },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
        { field: 'total' },
    ]);

    const [defaultColDef] = useState({
        flex: 1,
        minWidth: 150,
        filter: true,
        sortable: true,
    });

    const [rowData, setRowData] = useState<RowData[] | null>(null);

    useEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data: RowData[]) => setRowData(data));
    }, []);

    const promiseFromSave = new Promise<{ data: string; data2: string }>((resolve) => {
        setTimeout(() => {
            resolve({ data: 'some data', data2: 'some data 2' });
        }, 1000);
    });

    const handleButtonClick = useCallback(() => {
        promiseFromSave.then((data) => {
            console.log(data);
        });
    }, [promiseFromSave]);

    const containerStyle: React.CSSProperties = {
        width: '100vh',
        height: '100vh',
    };

    const gridStyle: React.CSSProperties = {
        height: '100%',
        width: '100%',
    };
    return (
        <div style={containerStyle}>
            <div style={gridStyle} className="ag-theme-material">
                <AgGridReact
                    modules={[ClientSideRowModelModule]}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowData={rowData}
                    pagination={true}
                    paginationPageSize={100}
                />
            </div>
        </div>
    );
};

export default AggridTest;