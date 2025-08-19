export interface UserEntry {

    id?: number;
    userName: string;
//<<<<<<< Current (Your changes)
// <<<<<<< Current (Your changes)
//     email:string;
//     password: string;

// =======
    email: string;
    password?: string;
    roles?: string[];
//>>>>>>> Incoming (Background Agent changes)
}
