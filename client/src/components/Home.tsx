import { useState, useEffect} from "react";
import styles from '../styles/home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faSearch, faChevronLeft, faChevronRight, faLock, faArrowLeft, faArrowRight  } from '@fortawesome/free-solid-svg-icons';
import { fetchHeaderTextPublic, fetchDateTextPublic, fetchPrizeTextPublic, fetchCardOneTextPublic, fetchCardTwoTextPublic, fetchCardThreeTextPublic } from "../services/fetchTextPublic";

import img1 from '../assets/image.jpg';
import img2 from '../assets/rifa.jpg';
import img3 from '../assets/image.jpg';
import img4 from '../assets/rifa.jpg';
import img5 from '../assets/image.jpg';
import imgMercadoPago from '../assets/mercadopago.png';
import imgMercado from '../assets/mercado-pago.png';
import img from '../assets/image-boleto.jpg';




const images = [img1, img2, img3, img4, img5];

const Home = () => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fade, setFade] = useState(false);
  const [text, setText] = useState("");
  const [textDate, setTextDate] = useState("");
  const [contentText, setContentText] = useState("");
  const [textCardOne, setTextCardOne] = useState("");
  const [textCardTwo, setTextCardTwo] = useState("");
  const [textCardThree, setTextCardThree] = useState("");
  const [errors, setErrors] = useState<{ general?: string }>({});

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setFade(true); 
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }, 200); 

    setTimeout(() => {
      setFade(false);
      setIsTransitioning(false);
    }, 500); 
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 200);

    setTimeout(() => {
      setFade(false);
      setIsTransitioning(false);
    }, 500);
  };

// ---------------------------
const totalNumbers = 100; // Número total de la rifa
const numbersPerPage = 30; // Cantidad de números por página
const [currentPage, setCurrentPage] = useState(0);

// Generar los números aleatorios UNA SOLA VEZ (para que no cambien al cambiar de página)
const allNumbers = Array.from({ length: totalNumbers }, () => Math.floor(Math.random() * 900) + 100);

// Obtener los números para la página actual
const startIndex = currentPage * numbersPerPage;
const visibleNumbers = allNumbers.slice(startIndex, startIndex + numbersPerPage);

// Funciones para cambiar de página
const nextPage = () => {
  if (startIndex + numbersPerPage < totalNumbers) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 0) {
    setCurrentPage(currentPage - 1);
  }
};
// ------------------------------------------------------------
  // Cargar todos los textos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ headerText, dateText, prizeText, cardOneText, cardTwoText, cardThreeText ] = await Promise.all([
          fetchHeaderTextPublic(),
          fetchDateTextPublic(),
          fetchPrizeTextPublic(),
          fetchCardOneTextPublic(),
          fetchCardTwoTextPublic(),
          fetchCardThreeTextPublic(),
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

    // contenedor principa
    <div className={styles.container}>

      <div className={styles.info}>
        <p>{text}</p>
      </div>
      <div className={styles.header}>
        <div className={styles.logo}>LOGO</div>
        <div className={styles.textInfo}>
          <p>{textDate}</p>
        </div>
      </div>

      {/* contenedor de informacion adicional o seccion */}
      <div className={styles.section}>

        {/* {contenido de la izquierda} */}
        <div className={styles.left}>
          <p>{contentText}</p>

          {/* Contenido de images con slider */}
          <div className={`${styles.image} ${fade ? styles.fade : ""}`} style={{ backgroundImage: `url(${images[currentIndex]})` }}>
            <div className={styles.imageButtons}>
              <div
                className={styles.buttonLeft}
                onClick={currentIndex === 0 ? undefined : prevSlide}>
                <FontAwesomeIcon icon={currentIndex === 0 ? faLock : faChevronLeft} size="1x" />
              </div>

              {/* Botón Derecho */}
              <div
                className={styles.buttonRight}
                onClick={currentIndex === images.length - 1 ? undefined : nextSlide}>
                <FontAwesomeIcon icon={currentIndex === images.length - 1 ? faLock : faChevronRight} size="1x" />
              </div>
            </div>
          </div>

        </div>

        {/* {contenido de la derecha} */}
        <div className={styles.right}>
          <p className={styles.text}>¡Y hay más premios!</p>
          <div className={styles.cardOne}>
            <span className={styles.contentImage}> 
              <FontAwesomeIcon icon={faTrophy} size="3x" color="gold" />
            </span>
            <p>{textCardOne}</p>
          </div>
          <div className={styles.cardTwo}>
            <span className={styles.contentImage}>
              <FontAwesomeIcon icon={faTrophy} size="3x" color="gold" />
            </span>
            <p>{textCardTwo}</p>
          </div>
          <div className={styles.cardThree}>
            <span className={styles.contentImage}>
              <FontAwesomeIcon icon={faTrophy} size="3x" color="gold" />
            </span>
            <p>{textCardThree}</p>
          </div>
          {/* {barra de progreso} */}
          <div className={styles.progressBar}>
            <progress className={styles.progress} value={70} max={100}></progress>
            <span className={styles.progressText}>70% Vendido</span>
          </div>
        </div>

      </div>

      {/* seccionn dos */}
      <div className={styles.sectionTwo}>
        <h3> Combos para participar 🥳</h3>
        <div className={styles.combo}>
          <div className={styles.oneCard}>
            <img src={img} alt="imagen de boleto" />
          </div>
          <div className={styles.twoCard}>
            <img src={img} alt="imagen de boleto" />
          </div>
        </div>

      </div>

      <div className={styles.chooseNumbers}>
        <h3>Escoge tus número 👇</h3>
        <div className={styles.searchNumbers}>
          <input type="text" placeholder="Buscar números..." />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        {/* lista de numeros */}
        <div className={styles.contentNumbers}>
          <div className={styles.numberList}>
            {visibleNumbers.map((num, i) => (
              <span key={i} className={styles.rifaNumber}>
                {num}
              </span>
            ))}
          </div>

          {/* Botones de navegación */}
          <div className={styles.buttonsNextPrev}>
            <div className={styles.buttonsContent}>
              <FontAwesomeIcon 
                icon={faArrowLeft} 
                className={styles.buttonBack} 
                onClick={prevPage} 
                style={{ opacity: currentPage === 0 ? 0.5 : 1, cursor: currentPage === 0 ? "default" : "pointer" }}
              />
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className={styles.buttonNext} 
                onClick={nextPage} 
                style={{ opacity: startIndex + numbersPerPage >= totalNumbers ? 0.5 : 1, cursor: startIndex + numbersPerPage >= totalNumbers ? "default" : "pointer" }}
              />
            </div>
          </div>

          <div className={styles.btnPay}>
            <button>Ir a pagar</button>
          </div>
        </div>

        <div className={styles.checkNumbers}>
          <button>Consultar mis números</button>
        </div>
      </div>

      <footer className={styles.footer}>
      <div className={styles.contentFooter}>
        <div className={styles.footerSection}>
          <p className={styles.footerName}>Rifas la pasinga</p>
          <p><a href="#" className={styles.footerLink}>Términos y Condiciones</a></p>
          <p className={styles.developer}>Desarrollado por: <span className={styles.name}>Ramiro González</span> </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Contáctanos</h3>
          <span className={styles.contactNumber}>(+57) 3003307232</span>
          <p className={styles.contactEmail}>castrogarcialuisjose@gmail.com</p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Medios de pago</h3>
          <div className={styles.paymentMethod}>
            <img src={imgMercado} className={styles.mercado} alt="Mercado Pago" />  
            <img src={imgMercadoPago} className={styles.methodPay} alt="Mercado Pago" />
          </div>
        </div>
      </div>


        <div className={styles.copyright}>
          © {new Date().getFullYear()}. Todos los derechos reservados.
        </div>

      </footer>


      {/* Mensajes de errores */}
      <p className={`${styles.errors} ${errors.general ? styles.show : ""}`}>
        {errors.general}
      </p>



    </div>


  );
};

export default Home;
