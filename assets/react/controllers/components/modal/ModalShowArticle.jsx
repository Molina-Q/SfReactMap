import React, { useRef, useEffect, useState } from "react";

const ModalShowArticle = ({ isOpen, onClose, data }) => {
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
                // setTimeout(() => {
                    modalElement.showModal();
                // }, 250);
            } else {
                modalElement.close();
                // children = "";
            }
        }
    }, [isModalOpen]);

    // // method to directly open the modal
    // const handleOpenModal = () => {
    //     if (!isOpen) {
    //         setModalOpen(true);
    //     }
    // }
    
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
            <button className="modal-close-btn" onClick={handleCloseModal} >Close</button>
            { console.log(" data from moda = ", data) }
            { data ? (
                <>
                    <h2>{data.article.Country.name} - {data.article.Century.year}</h2>
                    <h1>{data.article.title}</h1> 
                    <p>{data.article.summary}</p> 

                    <h3>{data.article.sections.length !== 0 ? data.article.sections[0].title : "This article doesn't have any section"}</h3>
                  <p>{data.article.sections.length !== 0  ? data.article.sections[0].text : "" }</p>
                </>)
            : (<h1>Sorry this country doesn't have an Article for this period.</h1>)}

        </dialog>
    );
  };

export default ModalShowArticle;