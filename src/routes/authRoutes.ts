import { Router } from "express";
import { login } from "../controllers/authController";
import { logoutAdmin } from "../controllers/logoutController";
import { textHeader } from "../controllers/updateTextHeaderController";
import { verifyToken } from "../middleware/verifyToken";
import { getHeaderText, getDateText, getPrizeText, getCardOneText, getCardTwoText, getCardThreeText } from "../controllers/getTextPanel";
import { getHeaderTextPublic, getDateTextPublic, getPrizeTextPublic, getCardOneTextPublic, getCardTwoTextPublic, getCardThreeTextPublic} from "../controllers/getTextPublic";
import { updateDateText } from "../controllers/updateDateTextController";
import { updateTextInformation } from "../controllers/updateTextInformationController";
import { updateTextCardOne } from "../controllers/updateTextCardOneController";
import { updateTextCardTwo } from "../controllers/updateTextCardTwoController";
import { updateTextCardThree } from "../controllers/updateTextCardThreeController";
import { uploadImage } from "../controllers/uploadImage";
import { getImages } from "../controllers/imageController";


const router = Router();

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
  await login(req, res);
});

// cerrar sesion
router.post('/logout', verifyToken, logoutAdmin);


// Ruta para mostrar textos en el home -----------------------------
router.get('/headerPublicText', async (req, res) => {
  await getHeaderTextPublic (req, res);
});
router.get('/datePublicText', async (req, res) => {
  await getDateTextPublic (req, res);
});
router.get('/prizePublicText', async (req, res) => {
  await getPrizeTextPublic (req, res);
});
router.get('/cardOnePublicText', async (req, res) => {
  await getCardOneTextPublic (req, res);
});
router.get('/cardTwoPublicText', async (req, res) => {
  await getCardTwoTextPublic (req, res);
});
router.get('/cardThreePublicText', async (req, res) => {
  await getCardThreeTextPublic (req, res);
});
// ---------------------------------------

// Ruta para actualizar el texto del header
router.put('/textHeader', verifyToken, async (req, res) => {
  await textHeader(req, res);
});

// Ruta para mostrar el texto de la fecha (rifa)
router.put('/textDate', verifyToken, async (req, res) => {
  await updateDateText (req, res);
});

// Ruta para mostrar el texto de la tarjeta numero 1
router.put('/updateTextInformation', verifyToken, async (req, res) => {
  await updateTextInformation (req, res);
});

// Ruta para actualizar el texto de la tarjeta numero 1
router.put('/updateTextCardOne', verifyToken, async (req, res) => {
  await updateTextCardOne (req, res);
});

// Ruta para actualizar el texto de la tarjeta numero 2
router.put('/updateTextCardTwo', verifyToken, async (req, res) => {
  await updateTextCardTwo (req, res);
});

// Ruta para actualizar el texto de la tarjeta numero 3
router.put('/updateTextCardThree', verifyToken, async (req, res) => {
  await updateTextCardThree (req, res);
});

// Ruta para mostrar el texto del header en el panel -------------------------------------
router.get('/headerText', verifyToken, async (req, res) => {
  await getHeaderText (req, res);
});

router.get('/dateText', verifyToken, async (req, res) => {
  await getDateText (req, res);
});

router.get('/prizeText', verifyToken, async (req, res) => {
  await getPrizeText (req, res);
});

router.get('/cardOneText', verifyToken, async (req, res) => {
  await getCardOneText (req, res);
});
router.get('/cardTwoText', verifyToken, async (req, res) => {
  await getCardTwoText (req, res);
});

router.get('/cardThreeText', verifyToken, async (req, res) => {
  await getCardThreeText (req, res);
});

router.get('/images', verifyToken, async (req, res) => {
  // console.log('pide las imagenes');
  await getImages (req, res);
});

// ---------------------------
// ruta para cargar las imagenes
router.post('/upload', verifyToken, async (req, res) => {
  // console.log('peticion para la imagen')
  await uploadImage (req, res);
});







export default router;
