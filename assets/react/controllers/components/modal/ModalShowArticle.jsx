import React, { useRef, useEffect, useState } from "react";

const ModalShowArticle = ({ isOpen, onClose, handleReturn, children }) => {
    // console.log('echo Modal');

    const [isModalOpen, setModalOpen] = useState(isOpen); // make the variable dynamic and change without reload
    const modalRef = useRef(null); // use to keep dialog element (object) stocked to check it's state

    // keep the isModalOpen and isOpen to the good state (false or true if it's open or not)
    useEffect(() => {
        setModalOpen(isOpen);
    }, [isOpen]);
    
    // update the state of the modal with our variable if isOpen is true it will do modal.showModal
    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
            if (isModalOpen) {
                setTimeout(() => {
                    modalElement.showModal();
                }, 250);
            } else {
                modalElement.close();
            }
        }
    }, [isModalOpen]);
    
    // method to directly close the modal
    const handleCloseModal = () => {
        if (onClose) {
          onClose();
        }    
        setModalOpen(false);
    };
 
    // method to close the modal while using escape as it is a native function of the dialog element
    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          handleCloseModal();
        }
    }; 
    
    return (
        <dialog ref={modalRef} className="modal" onKeyDown={handleKeyDown} id="myDialog">

            <button type="button" className="modal-close-btn" onClick={handleCloseModal} > 
                <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">{/*Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </button>

            <button type="button" className="modal-return-arrow" onClick={handleReturn}>
                <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">{/*Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
            </button>
            
            {/* this is props.children this will show everything written inside the component element in the top component calling it */}
            {children}

        </dialog>
    );
  };

export default ModalShowArticle;