import React from 'react'

export default function ProfilLogo(props) {
        return (
            <div className={`profile-picture ${props.class}`}>
                <img src={props.photo} alt="profil" className="" />
            </div>
        )
}
 