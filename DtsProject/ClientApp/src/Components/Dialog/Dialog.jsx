import React, { useEffect, useRef, useState } from 'react';
import './Dialog.css';


const Dialog = ({ show, content, closeDialog }) => {

    const modalRef = useRef();

    function CloseModal(event) {
        if (event.target === modalRef.current) {
            closeDialog();
        }
    }

    useEffect(() => {
        window.addEventListener('click', CloseModal);
        return () => {
            window.removeEventListener('click', CloseModal);
        }

    }, []);

    return (
        <>
            {show &&
                <div id="myModal" className="modal" ref={modalRef} style={{ direction: 'rtl' }}>
                    <div className="content-modal">
                        <div className="close" onClick={closeDialog}>&times;</div>
                        {content}
                    </div>
                </div>
            }
        </>
    );
}
export default Dialog;