import styles from '../styles/panel.module.css';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { textHeader } from "../services/updateTextHeader";
import { dateText } from "../services/updateTextDate";
import { updateText } from "../services/updateTextService";
import { updateTextCardOne } from "../services/updateTextCardOne";
import { updateTextCardTwo } from "../services/updateTextCardTwo";
import { updateTextCardThree } from "../services/updateTextCardThree";
import { fetchHeaderTextAdmin, fetchDateTextAdmin, fetchPrizeTextAdmin, fetchCardOneText, fetchCardTwoText, fetchCardThreeText, fetchImages} from '../services/fetchAdminTexts';
import { generateRaffleNumbers } from "../services/raffleService"

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
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [totalNumbers, setTotalNumbers] = useState<number>(0);
  const [digits, setDigits] = useState<number>(3);
  const [startRange, setStartRange] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  console.log("API URL definida:", API_URL); 
  // token del usuario para uso global
  const token = localStorage.getItem("token");

  // seleccionar imagenes
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleAddImage = async () => {
    if (!file) {
      setErrors({ general: "Por favor, selecciona una imagen" });
      setSuccessMessage(""); 
    
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // "image" es el campo que leerá el backend

    try {
       const response =  await axios.post<{ url: string }>(`${API_URL}/api/auth/upload`, formData, {
            headers: { 
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
        });

        const newImageUrl = response.data.url;
        console.log('🔄 Se agregó o actualizó una imagen:', newImageUrl);

        setImageList((prevImages) => {
          const newImageBase = newImageUrl.replace(/\.[^.]+$/, ""); // Remueve la extensión
        
          // Verifica si ya existe una imagen con el mismo nombre base
          const exists = prevImages.some((image) => {
            const existingBase = image.replace(/\.[^.]+$/, ""); 
            return existingBase === newImageBase;
          });
        
          if (exists) {
            // 🔄 Si existe, reemplaza la imagen con la nueva URL
            return prevImages.map((image) => {
              const existingBase = image.replace(/\.[^.]+$/, "");
              return existingBase === newImageBase ? newImageUrl : image;
            });
          } else {
            // ➕ Si no existe, la agrega a la lista
            return [...prevImages, newImageUrl];
          }
        });

        
        setSuccessMessage("Imagen subida con éxito");
        setFile(null); // Limpiar estado del archivo
        setFileName(""); // Limpiar el nombre del archivo
    
        // Limpiar el input de tipo file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setTimeout(() =>  setSuccessMessage(""), 5000); 
    } catch (error: any) {
      console.error(error, 'el error completo')
      const errorData = error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
      setSuccessMessage(""); // Asegura que el mensaje de éxito desaparezca
      setErrors(errorData); 
      setTimeout(() => setErrors({}), 5000); 
    }
  };


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
      setSuccessMessage("Actulización exitosa");
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
        const [headerText, dateText, prizeText, cardOneText, cardTwoText, cardThreeText, images] = await Promise.all([
          fetchHeaderTextAdmin(token),
          fetchDateTextAdmin(token),
          fetchPrizeTextAdmin(token),
          fetchCardOneText(token),
          fetchCardTwoText(token),
          fetchCardThreeText(token),
          fetchImages(token),
        ]);

        // console.log("🖼️ Imágenes recibidas en el frontend:", images);

        setText(headerText);
        setTextDate(dateText);
        setContentText(prizeText);
        setTextCardOne(cardOneText);
        setTextCardTwo(cardTwoText);
        setTextCardThree(cardThreeText);
        setImageList(images);
      } catch (error: any) {
        const errorData = error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
        setErrors(errorData);
        setTimeout(() => setErrors({}), 5000);
      }
    };

    fetchData();
  }, []);

  // agregar numeros a la bd
  const handleGenerateNumbers = async () => {
    try {
      const message = await generateRaffleNumbers(totalNumbers, digits, startRange, token);
  
      setErrors({});
      setShowModal(false);
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
       // Limpiar inputs
      setTotalNumbers(0);
      setDigits(3);  
      setStartRange(0);
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error: any) {
      setErrors(error);
      setSuccessMessage(null);
      setTimeout(() => setErrors({}), 5000);
    }
  };

  // cerrar sesion
  const handleLogout = async () => {
    try {
       if (!token) return;

       await axios.post(
        `${API_URL}/api/auth/logout`, {}, 
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
      );
    
        localStorage.removeItem("token");
        navigate("/panelLogin");
    } catch (error: any) {
        setErrors(error.response?.data?.errors || { general: "Ocurrió un error inesperado." });
        setTimeout(() => setErrors({}), 5000);
    }
  };

   
  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = "hidden"; 
    document.body.style.pointerEvents = "none"; 
  };
  
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto"; 
    document.body.style.pointerEvents = "auto"; 
  };
  
  
  


  return (
      <div className={styles.contentAll}>
      {/* modal de confirmación */}
        {showModal && (
          <div className={styles.modal}>
            <p>¿Confirmar?</p>
            <button onClick={handleGenerateNumbers}>Sí</button>
            <button onClick={closeModal}>No</button>
          </div>
        )}

        {/* contenido del header */}
          <div className={styles.textPanel}>
            <h1>Panel de administrador</h1>
            <button onClick={handleLogout}>Salir</button>
          </div>
          
          {/* mensajes de errores */}
          {errors.general && <p className={styles.error}>{errors.general}</p>}

          {/* mensaje de guardado con exito */}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

          {/* Contenido de información que se agrega a la vista principal */}
          <div className={styles.raffleInfo}>
            <div className={styles.raffleInfoHeader}>
              <h5 className={styles.raffleInfoTitle}>Agregar textos generales</h5>
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

          <div className={styles.contentImages}>
            <h3>Agregar imagenes</h3>
          
            <div 
              className={styles.contentInputImages} 
              onClick={() => document.getElementById("fileInput")?.click()}
              data-file-name={fileName} // Se usa en CSS
            >
              <input 
                type="file" 
                ref={fileInputRef}
                id="fileInput"
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={handleImageUpload} 
              />
            </div>
            <button className={styles.addButton} onClick={handleAddImage}> Agregar </button>
          </div>

          {/* mueestra las imagenes en el panel */}
          <div className={styles.contentImagesPanel}>
            <div className={styles.contentAllImages}>
            {imageList.map((image, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_API_URL}${image}`}
                alt={`Premio ${index + 1}`} 
              />
            ))}
            </div>
          </div>

          <div className={styles.contentCreateNumbers}>
            <h3>Crear números</h3>
            <div className={styles.createNumbers}>
              <input type="text" placeholder="Cantidad de números" value={totalNumbers || ""} 
              onChange={(e) => setTotalNumbers(Number(e.target.value))} />
              <select value={digits} onChange={(e) => setDigits(Number(e.target.value))}>
                <option value="3">3 cifras</option>
                <option value="4">4 cifras</option>
              </select>
              <input type="text" placeholder="Prefijo (opcional)" />
              <input type="text" placeholder="Rango de inicio" value={startRange || ""} 
              onChange={(e) => setStartRange(Number(e.target.value))} />
            </div>
            <div className={styles.contentButton}>
              <button  onClick={openModal}>Generar</button>
            </div>
            
          </div>


      </div>
  );
};

export default Panel;