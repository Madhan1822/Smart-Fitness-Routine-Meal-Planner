import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
export declare const getDb: () => Promise<Database<sqlite3.Database, sqlite3.Statement>>;
declare const _default: {
    query: (sql: string, params?: any[]) => Promise<any[][] | {
        insertId: number | undefined;
        affectedRows: number | undefined;
    }[]>;
};
export default _default;
//# sourceMappingURL=db.d.ts.map