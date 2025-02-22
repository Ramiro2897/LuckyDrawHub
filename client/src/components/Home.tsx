import styles from '../styles/home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

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
          <div className={styles.image}>

          </div>
          <div className={styles.slider}>
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

          </div>


        </div>


      </div>



      <h1 className={styles.title}>¡Bienvenido a LuckyDrawHub!</h1>
      <p className={styles.description}>
        Este es el inicio de tu aplicación. Personalízalo como quieras.
      </p>
      <button className={styles.button}>Empezar</button>


    </div>


  );
};

export default Home;
