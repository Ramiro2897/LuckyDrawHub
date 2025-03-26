import { useState, useEffect} from "react";
import styles from '../styles/home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faTrophy, faSearch, faChevronLeft, faChevronRight, faLock, faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { 
  fetchHeaderTextPublic, 
  fetchDateTextPublic, 
  fetchPrizeTextPublic, 
  fetchCardOneTextPublic, 
  fetchCardTwoTextPublic, 
  fetchCardThreeTextPublic, 
  fetchImagePublic, 
  fetchAllNumbers, 
  fetchRaffleProgress,
  fetchNumbersBySearch 
} from "../services/fetchTextPublic";
import PaymentModal from "../components/PaymentModal";
import ModalSearchNumber from "../components/ModalSearchNumber";


import imgMercadoPago from '../assets/mercadopago.png';
import imgMercado from '../assets/mercado-pago.png';

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
  const [imagesPublic, setImagesPublic] = useState<string[]>([]);
  const [otherImages, setOtherImages] = useState<string[]>([]);
  const [allNumbers, setAllNumbers] = useState<number[]> ([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredNumbers, setFilteredNumbers] = useState<number[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ general?: string; search?: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSearchOpen, setIsModalSearchOpen] = useState(false);
  const [raffleProgress, setRaffleProgress] = useState<number>(0);
  const [rafflePrice, setRafflePrice] = useState(0);


  // pasar imagenes
  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setFade(true); 
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? imagesPublic.length - 1 : prevIndex - 1));
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
      setCurrentIndex((prevIndex) => (prevIndex === imagesPublic.length - 1 ? 0 : prevIndex + 1));
    }, 200);

    setTimeout(() => {
      setFade(false);
      setIsTransitioning(false);
    }, 500);
  };

// --------------------------- Mostrar los números----------------------------
  const numbersPerPage = 30; // Cantidad de números por página
  const [currentPage, setCurrentPage] = useState(0);

  // Obtener los números para la página actual
  const startIndex = currentPage * numbersPerPage;
  const visibleNumbers = allNumbers.slice(startIndex, startIndex + numbersPerPage);

  // Funciones para cambiar de página
  const nextPage = () => {
    if ((currentPage + 1) * numbersPerPage < allNumbers.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Cargar todos los textos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ headerText, dateText, prizeText, cardOneText, cardTwoText, cardThreeText, images, numbersData, progress ] = await Promise.all([
          fetchHeaderTextPublic(),
          fetchDateTextPublic(),
          fetchPrizeTextPublic(),
          fetchCardOneTextPublic(),
          fetchCardTwoTextPublic(),
          fetchCardThreeTextPublic(),
          fetchImagePublic(),
          fetchAllNumbers(),
          fetchRaffleProgress(),
        ]);

        setText(headerText);
        setTextDate(dateText);
        setContentText(prizeText);
        setTextCardOne(cardOneText);
        setTextCardTwo(cardTwoText);
        setTextCardThree(cardThreeText);
        setImagesPublic(images.slice(0, 4));
        setOtherImages(images.slice(4, 6));
        setAllNumbers(numbersData.numbers);
        setRafflePrice(numbersData.price);
        setRaffleProgress(progress);
      } catch (error: any) {
        const errorData = error.response?.data?.errors || { general: "Ocurrió un error inesperado." };
        setErrors(errorData);
        setTimeout(() => setErrors({}), 5000);
      }
    };

    fetchData();
  }, []);

  // realizar la busqueda
  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const numbers = await fetchNumbersBySearch(searchTerm);
  
      if (numbers.length > 0) {
        setFilteredNumbers(numbers); // Solo actualizar si hay resultados
      } else {
        setFilteredNumbers([]); // Si no hay resultados, limpiamos
      }
  
      setErrors({});
    } catch (error: any) {
      setErrors(error);
      setFilteredNumbers([]);
      setTimeout(() => setErrors({}), 5000);
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (value === "") {
      setIsSearching(false); // Dejar de buscar cuando se borra
      setFilteredNumbers([]); // Resetear búsqueda
    }
  };
  
  const toggleNumberSelection = (num: number) => {
    setSelectedNumbers((prevSelected) =>
      prevSelected.includes(num)
        ? prevSelected.filter((n) => n !== num) // Si ya está, lo quita
        : [...prevSelected, num] // Si no está, lo agrega
    );
  };

  return (

    // contenedor principa
    <div className={styles.container}>

      <div className={styles.info}>
        <p>{text}</p>
      </div>
      <div className={styles.header}>
        <div className={styles.logo}></div>
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
          <div className={`${styles.image} ${fade ? styles.fade : ""}`} style={{ backgroundImage: `url(${import.meta.env.VITE_API_URL}${imagesPublic[currentIndex]})` }}>
            <div className={styles.imageButtons}>
              <div
                className={styles.buttonLeft}
                onClick={currentIndex === 0 ? undefined : prevSlide}>
                <FontAwesomeIcon icon={currentIndex === 0 ? faLock : faChevronLeft} size="1x" />
              </div>

              {/* Botón Derecho */}
              <div
                className={styles.buttonRight}
                onClick={currentIndex === imagesPublic.length - 1 ? undefined : nextSlide}>
                <FontAwesomeIcon icon={currentIndex === imagesPublic.length - 1 ? faLock : faChevronRight} size="1x" />
              </div>
            </div>
          </div>

        </div>

        {/* {contenido de la derecha} */}
        <div className={styles.right}>
          <p className={styles.text}>¡Y hay más premios!</p>
          <div className={styles.cardOne}>
            <span className={styles.contentImage}> 
              <FontAwesomeIcon icon={faTrophy} size="3x" color="#F2C744" />
            </span>
            <p>{textCardOne}</p>
          </div>
          <div className={styles.cardTwo}>
            <span className={styles.contentImage}>
              <FontAwesomeIcon icon={faTrophy} size="3x" color="#F2C744" />
            </span>
            <p>{textCardTwo}</p>
          </div>
          <div className={styles.cardThree}>
            <span className={styles.contentImage}>
              <FontAwesomeIcon icon={faTrophy} size="3x" color="#F2C744" />
            </span>
            <p>{textCardThree}</p>
          </div>
          {/* {barra de progreso} */}
          <div className={styles.progressBar}>
            <progress className={styles.progress} value={raffleProgress} max={100}></progress>
            <span className={styles.progressText}>{raffleProgress}% Vendido</span>
          </div>
        </div>

      </div>

      {/* seccionn dos */}
      <div className={styles.sectionTwo}>
        <h3> Combos para participar 🥳</h3>
        <div className={styles.combo}>
          <div className={styles.oneCard}>
            <img src={`${import.meta.env.VITE_API_URL}${otherImages[0]}`} alt="Premio 5" />
          </div>
          <div className={styles.twoCard}>
            <img src={`${import.meta.env.VITE_API_URL}${otherImages[1]}`} alt="Premio 6" />
          </div>
        </div>

      </div>

      <div className={styles.chooseNumbers}>
        <h3>Escoge tus números 👇</h3>
        <div className={styles.searchNumbers}>
          <input type="text" placeholder="Buscar números..."  value={searchTerm}
           onChange={handleInputChange} 
           />
          <button onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorSearch}>{errors.search || errors.general}</p>
        </div>
        {/* Lista de números (Filtrados o Todos) */}
        <div className={styles.contentNumbers}>
          <div className={styles.numberList}>
            {isSearching && filteredNumbers.length > 0 ? (
              <>
                <button className={styles.backButton} onClick={() => {
                  setIsSearching(false);
                  setCurrentPage(0);
                }}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                {filteredNumbers.map((num, i) => (
                  <span 
                    key={i} 
                    className={`${styles.rifaNumber} ${selectedNumbers.includes(num) ? styles.selected : ""}`} 
                    onClick={() => toggleNumberSelection(num)}
                  >
                  {num}
                  </span>
                ))}
                </>
                ) : (
                visibleNumbers.map((num, i) => (
                  <span 
                    key={i} 
                    className={`${styles.rifaNumber} ${selectedNumbers.includes(num) ? styles.selected : ""}`} 
                    onClick={() => toggleNumberSelection(num)}
                  >
                    {num}
                  </span>
               ))
            )}

          </div>

          {/* Botones de navegación */}
          {!(isSearching && filteredNumbers.length > 0) && (
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
                  style={{ opacity: startIndex + numbersPerPage >= allNumbers.length ? 0.5 : 1, cursor: startIndex + numbersPerPage >= allNumbers.length ? "default" : "pointer" }}
                />
              </div>
            </div>
          )}
          <div className={styles.btnPay}>
            <button onClick={() => {
              setIsModalOpen(true);
              document.documentElement.style.overflow = "hidden";
              document.body.style.overflow = "hidden";
            }}> Ir a pagar
            </button>
          
            <PaymentModal isOpen={isModalOpen} onClose={() => {
              setIsModalOpen(false);
              document.documentElement.style.overflow = "auto";
              document.body.style.overflow = "auto";
            }}
              selectedNumbers={selectedNumbers}
              rafflePrice={rafflePrice} 
             />
          </div>
        </div>

        <div className={styles.checkNumbers}>
          <button className={styles.btnCheckNumbers} onClick={() => {
            setIsModalSearchOpen(true);
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
          }}>
            Consultar mis números
          </button>
        
          <ModalSearchNumber 
            isOpen={isModalSearchOpen} 
            onClose={() => {
              setIsModalSearchOpen(false);
              document.documentElement.style.overflow = "auto";
              document.body.style.overflow = "auto";
            }} 
          />
        </div>
      </div>

      <footer className={styles.footer}>
      <div className={styles.contentFooter}>
        <div className={styles.footerSection}>
          <p className={styles.footerName}>¡Rifas la mentira! 😂</p>
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

      <div className={styles.whatsappButton}>
        <a href="https://wa.me/573003307232" title="Contáctanos en WhatsApp" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon className={styles.whatsappIcon} icon={faWhatsapp} />
        </a>
      </div>

      {/* Mensajes de errores */}
      <p className={`${styles.errors} ${errors.general ? styles.show : ""}`}>
        {errors.general}
      </p>

    </div>


  );
};

export default Home;
