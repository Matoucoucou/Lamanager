import { CircleUser } from "lucide-react";
import { Link } from '@inertiajs/react';

function BoutonProfil() {
    return (
        <Link href="/profil">
            <CircleUser size={35} className="circle-user"/>
        </Link>
    )
}

export default BoutonProfil;