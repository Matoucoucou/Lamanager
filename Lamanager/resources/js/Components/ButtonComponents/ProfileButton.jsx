import { CircleUser } from "lucide-react";
import { Link } from '@inertiajs/react';

function ProfileButton() {
    return (
        <Link href="/profil">
            <CircleUser size={35} className="circle-user"/>
        </Link>
    )
}

export default ProfileButton;
