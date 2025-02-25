import styles from '../styles/home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faSearch  } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import image from '../assets/image.jpg';

const Home = () => {
  return (

    // contenedor principa
    <div className={styles.container}>

      <div className={styles.info}>
        <p>¡Última oportunidad! 💥 antes 2x $110.000 HOY 2x $100.000 😱 
          ¡Corre antes de que se acaben! 🏃💨</p>
      </div>
      <div className={styles.header}>
        <div className={styles.logo}>LOGO</div>
        <div className={styles.textInfo}>
          <p>📅️ Juega este 28 de febrero con las 3 
          últimas cifras de la de Medellín.
          </p>
        </div>
      </div>

      {/* contenedor de informacion adicional o seccion */}
      <div className={styles.section}>

        {/* {contenido de la izquierda} */}
        <div className={styles.left}>
          <p> ¡Gran sorteo de un espectacular Caballo capon 🐎 
            Trocha Pura Totalmente Aperado 🤩!
          </p>

          {/* contenido de images con slider */}
          <div className={styles.image}>
             {/* Aquí va tu contenido de imagen */}
          </div>

           {/* Contenedor del slider */}
          <div className={styles.slider}>
          <Swiper
            className="swiper-container"
            spaceBetween={10}
            slidesPerView={3}
            navigation
            modules={[Navigation]}
            breakpoints={{
              320: { slidesPerView: 2 }, // 1 slide en móviles pequeños
              480: { slidesPerView: 2 }, // 2 slides en móviles medianos
              768: { slidesPerView: 3 }, // 3 slides en tablets y más grandes
            }}
            onSlideChange={() => console.log("Slide cambiado")}
            onSwiper={(swiper) => console.log(swiper)}>
             <SwiperSlide className="swiper-slide">
              <img src={image} alt="Imagen 1" className={styles.sliderImage}/>
             </SwiperSlide>
             <SwiperSlide>
              <img src={image} alt="Imagen 1" className={styles.sliderImage} />
             </SwiperSlide>
             <SwiperSlide>
               <img src={image} alt="Imagen 2" className={styles.sliderImage} />
             </SwiperSlide>
             <SwiperSlide>
               <img src={image} alt="Imagen 3" className={styles.sliderImage} />
             </SwiperSlide>
             <SwiperSlide>
               <img src={image} alt="Imagen 4" className={styles.sliderImage} />
             </SwiperSlide>
          </Swiper>
          </div>





        </div>

        {/* {contenido de la derecha} */}
        <div className={styles.right}>
          <p className={styles.text}>¡Y hay más premios!</p>
          <div className={styles.cardOne}>
            <span className={styles.contentImage}> 
              <FontAwesomeIcon icon={faTrophy} size="3x" color="gold" />
            </span>
            <p>¡Caballo Capón de trocha pura, completamente aperado! 🐴🏇🏼💥
              Con las tres últimas cifras de la de Medellín
            </p>
          </div>
          <div className={styles.cardTwo}>
            <span className={styles.contentImage}>
              <FontAwesomeIcon icon={faTrophy} size="3x" color="gold" />
            </span>
            <p>¡Premio de 🤑 $2.000.000🤑 con las tres primeras
               cifras de la de Medellín! 💰💥🔢
            </p>
          </div>
          <div className={styles.cardThree}>
            <span className={styles.contentImage}>
              <FontAwesomeIcon icon={faTrophy} size="3x" color="gold" />
            </span>
            <p> ¡Premio de 🤑 $1.000.000🤑 para quien más números compre! 🤑💵🎉
            </p>
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
          <div className={styles.oneCard}></div>
          <div className={styles.twoCard}></div>
        </div>

      </div>

      <div className={styles.chooseNumbers}>
        <h3>Escoge tus número 👇</h3>
        <div className={styles.searchNumbers}>
          <input type="text" placeholder="Buscar número..." />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className={styles.contentNumbers}>
          <p>Contenido de números</p>
        </div>



      </div>


    </div>


  );
};

export default Home;
