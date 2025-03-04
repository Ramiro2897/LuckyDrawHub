import styles from '../styles/panel.module.css';
import { useState, useEffect } from "react";
import { textHeader } from "../services/updateTextHeader";
import { dateText } from "../services/updateTextDate";
import { updateText } from "../services/updateTextService";
import {updateTextCardOne} from "../services/updateTextCardOne";
import {updateTextCardTwo} from "../services/updateTextCardTwo";
import {updateTextCardThree} from "../services/updateTextCardThree";
import { fetchHeaderTextAdmin, fetchDateTextAdmin, fetchPrizeTextAdmin, fetchCardOneText, fetchCardTwoText, fetchCardThreeText } from '../services/fetchAdminTexts';

const Panel = () => {
  const [title] = useState("contenido header");
  const [titleDate] = useState("contenido fecha");
  const [titlePrize] = useState("contenido premio");
  const [titleCardOne] = useState("contenido premio uno");
  const [titleCardTwo] = useState("contenido premio dos");
  const [titleCardThree] = useState("contenido premio tres");
  const [text, setText] = useState<string>("Aquí la información o la que quiere editar");
  const [textDate, setTextDate] = useState<string>("Aquí la información o la que quiere editar");
  const [contentText, setContentText] = useState<string>("Aquí la información o la que quiere editar");
  const [textCardOne, setTextCardOne] = useState<string>("Aquí la información o la que quiere editar");
  const [textCardTwo, setTextCardTwo] = useState<string>("Aquí la información o la que quiere editar");
  const [textCardThree, setTextCardThree] = useState<string>("Aquí la información o la que quiere editar");
  const [errors, setErrors] = useState<{ general?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  // actualiza cada vez que se escriba
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
  const handleTextChangeDate = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextDate(event.target.value);
  };
  const handleContentTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentText(event.target.value);
  };
  const handleTextCardOneChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextCardOne(event.target.value);
  };
  const handleTextCardTwoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextCardTwo(event.target.value);
  };
  const handleTextCardThreeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextCardThree(event.target.value);
  };
  

  // token del usuario para uso global
  const token = localStorage.getItem("token");

  // funcion al dar clic para guardar el texto
  const handleSaveText = async (updateFunction: Function, title: string, text: string, setTextFunction: Function) => {
    const response: any = await updateFunction(title, text);
  
    if (response?.errors) {
      setSuccessMessage(null);
      setErrors(response.errors);
      setTimeout(() => setErrors({}), 5000);
      return;
    }
  
    if (response?.data) {
      setTextFunction(response.data.content);
      setErrors({}); 
      setSuccessMessage("successful");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };
  
  const handleSave = () => handleSaveText(textHeader, title, text, setText);
  const handleSaveTextDate = () => handleSaveText(dateText, titleDate, textDate, setTextDate);
  const handleSaveContentText = () => handleSaveText(updateText, titlePrize, contentText, setContentText);
  const handleSaveTextCardOne = () => handleSaveText(updateTextCardOne, titleCardOne, textCardOne, setTextCardOne);
  const handleSaveTextCardTwo = () => handleSaveText(updateTextCardTwo, titleCardTwo, textCardTwo, setTextCardTwo);
  const handleSaveTextCardThree = () => handleSaveText(updateTextCardThree, titleCardThree, textCardThree, setTextCardThree);

  //  cargar datos al cargar la pagina
  useEffect(() => {
    if (!token) {
      setErrors({ general: "No hay sesión activa." });
      return;
    }

    const fetchData = async () => {
      try {
        const [headerText, dateText, prizeText, cardOneText, cardTwoText, cardThreeText] = await Promise.all([
          fetchHeaderTextAdmin(token),
          fetchDateTextAdmin(token),
          fetchPrizeTextAdmin(token),
          fetchCardOneText(token),
          fetchCardTwoText(token),
          fetchCardThreeText(token),
        ]);

        setText(headerText);
        setTextDate(dateText);
        setContentText(prizeText);
        setTextCardOne(cardOneText);
        setTextCardTwo(cardTwoText);
        setTextCardThree(cardThreeText);
      } catch (error: any) {
        const errorData = error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
        setErrors(errorData);
        setTimeout(() => setErrors({}), 5000);
      }
    };

    fetchData();
  }, []);
  
  return (
      <div className={styles.contentAll}>
        {/* contenido del header */}
          <div className={styles.textPanel}>
            <h1>Panel de administrador</h1>
            <button>Salir</button>
          </div>
          
          {/* mensajes de errores */}
          <p className={`${styles.error} ${!errors.general ? "hidden" : ""}`}>{errors.general}</p>
          {/* mensaje de guardado con exito */}
          <p className={`${styles.successMessage} ${successMessage ? styles.show : ""}`}>{successMessage}</p>


          {/* Contenido de información que se agrega a la vista principal */}
          <div className={styles.raffleInfo}>
            <div className={styles.raffleInfoHeader}>
              <h3 className={styles.raffleInfoTitle}>Información de rifa</h3>
            </div>
            
            {/* ------------------ ---------------------------------------------------------*/}
            <div className={styles.raffleInfoContent}>
              <div className={styles.raffleInfoItem}>
                <p className={styles.raffleInfoHeader}>{title}</p> {/* Mostramos el título dinámico */}
                <textarea
                className={styles.raffleInfoTextarea}
                value={text}
                onChange={handleTextChange}
                />

                <div className={styles.raffleInfoActions}>
                  <button className={styles.raffleInfoButton} onClick={handleSave}>Guardar</button>
                </div>
              </div>

              {/* --------------- */}
              <div className={styles.raffleInfoItem}>
                <p className={styles.raffleInfoHeader}>{titleDate}</p>
                <textarea
                className={styles.raffleInfoTextarea}
                value={textDate}
                onChange={handleTextChangeDate}
                />
                <div className={styles.raffleInfoActions}>
                  <button className={styles.raffleInfoButton} onClick={handleSaveTextDate}>Guardar</button>
                </div>
              </div>

              {/* --------------- */}
              <div className={styles.raffleInfoItem}>
                <p className={styles.raffleInfoHeader}>{titlePrize}</p>
                <textarea
                className={styles.raffleInfoTextarea}
                value={contentText}
                onChange={handleContentTextChange}
                />
                <div className={styles.raffleInfoActions}>
                  <button className={styles.raffleInfoButton} onClick={handleSaveContentText}>Guardar</button>
                </div>
              </div>

              {/* ---------------- */}
              <div className={styles.raffleInfoItem}>
                <p className={styles.raffleInfoHeader}>{titleCardOne}</p>
                <textarea
                className={styles.raffleInfoTextarea}
                value={textCardOne}
                onChange={handleTextCardOneChange}
                />
                <div className={styles.raffleInfoActions}>
                  <button className={styles.raffleInfoButton} onClick={handleSaveTextCardOne}>Guardar</button>
                </div>
              </div>
              {/* ---------------- */}
              <div className={styles.raffleInfoItem}>
                <p className={styles.raffleInfoHeader}>{titleCardTwo}</p>
                <textarea
                className={styles.raffleInfoTextarea}
                value={textCardTwo}
                onChange={handleTextCardTwoChange}
                />
                <div className={styles.raffleInfoActions}>
                  <button className={styles.raffleInfoButton} onClick={handleSaveTextCardTwo}>Guardar</button>
                </div>
              </div>
                {/* ---------------- */}
              <div className={styles.raffleInfoItem}>
                <p className={styles.raffleInfoHeader}>{titleCardThree}</p>
                <textarea
                className={styles.raffleInfoTextarea}
                value={textCardThree}
                onChange={handleTextCardThreeChange}
                />
                <div className={styles.raffleInfoActions}>
                  <button className={styles.raffleInfoButton} onClick={handleSaveTextCardThree}>Guardar</button>
                </div>
              </div> 
            </div>



          </div>
      </div>
  );
};

export default Panel;