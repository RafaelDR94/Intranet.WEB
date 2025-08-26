import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    fontSize: 8,
    fontFamily: 'Mechanical',
  },
  content: {
    padding: '20 30 30 30', // Ajuste para que respete el espacio del logo
  },
  section: {},
  tableHeader: {
    backgroundColor: '#001E2F',
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7, // Espacio entre los elementos
    marginBottom: 1,
  },
  cell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // Alinear label y text verticalmente
    marginBottom: 2,
    width: '48%', // Cada celda ocupa 48% para dejar un pequeño espacio entre ellas
  },
  fullWidthCell: {
    width: '100%', // Ocupa toda la fila
    flexDirection: 'row',
    alignItems: 'center', // Alinear verticalmente el contenido
    marginBottom: 2, // Separación adicional debajo
  },
  labelText: {
    fontWeight: 'bold',
    marginRight: 5,
    backgroundColor: '#e0e0e0',
    padding: 2,
    flexShrink: 0, // Evita que el label se reduzca
  },
  text: {
    flex: 1, // Ocupa el espacio restante
    margin: 5,
  },
  titleText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 65,
  },
  watermark: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Centra las imágenes horizontalmente
    gap: 20, // Espaciado uniforme entre las imágenes
  },
  imageCard: {
    display: 'flex',
    alignItems: 'center', // Centra el contenido de la tarjeta
    border: '1px solid #e0e0e0',
    padding: 0, // Añade algo de padding interno
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 0,
    width: 240, // Mantiene el mismo ancho que la imagen
  },
  imageTitle: {
    fontSize: 9,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageDescription: {
    width: '100%', // Ancho fijo igual al de la tarjeta
    minHeight: 30, // Altura mínima para garantizar 3 líneas
    maxHeight: 50, // Limitar la altura
    fontSize: 8,
    backgroundColor: '#e0e0e0',
    textAlign: 'center',
    overflow: 'hidden', // Oculta el exceso de texto
    padding: 2, // Espaciado interno
  },
  imageStyle: {
    width: 240, // Ancho fijo
    height: 130, // Altura fija
    objectFit: 'contain',
    marginBottom: 0,
  },
  signatureContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  signatureBox: {
    width: '23%', // Ajusta para que quepan 4 firmas por fila
    padding: 10,
    textAlign: 'center',
    marginBottom: 10,
    border: '1px solid #e0e0e0',
  },
  signatureImage: {
    width: '100%',          // Ajusta el ancho al 100% del contenedor de la firma
    height: 40,             // Altura constante para la firma
    objectFit: 'contain',   // Contiene la imagen sin deformarla
    marginBottom: 5,
    alignSelf: 'center',    // Centra la firma horizontalmente
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#000',
    marginVertical: 5,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  signatureCharge: {
    fontSize: 9,
    marginTop: 5,
  },
  progressBarContainer: {
    width: '30%', // Ajusta el tamaño según tu diseño
    backgroundColor: '#e0e0e0',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginLeft: "40px"
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#001E2F', // Color de progreso
  },
  folioText: {
    fontSize: 9,
    fontWeight: 'bold',
    marginRight: "40px",
    marginTop: "40px",
    textAlign: 'right',
  },
  progressText: {
    fontSize: 9,
    marginLeft: "40px",
    marginBottom: 5
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'right',
    fontSize: 8,
    marginRight: "35px",
    fontWeight: "light",
    opacity: 0.5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    left: 35,
    fontSize: 8,
    color: 'white',
  },
  tableContainer: {
    marginVertical: 10,
  },
  tableHeaders: {
    backgroundColor: '#001E2F',
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 1,
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    textAlign: 'center',
    flex: 1, // Asegura que las celdas sean flexibles
  },
  headerCell: {
    fontWeight: 'bold',
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  listBullet: {
    width: 10, // Espacio para la viñeta
    fontSize: 10,
  },
  listItemText: {
    flex: 1,
    fontSize: 8,
    marginLeft: 5,
  },

  headerBox: {
    position: 'absolute',
    top: 20,
    right: 35,
    width: 240, // Ancho mayor para que quepa el título
    borderWidth: 1,
    borderColor: '#001E2F',
    borderStyle: 'solid',
    padding: 4,
  },
  headerBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  headerBoxRowSingle: {
    marginBottom: 2,
  },
  headerBoxTitle: {
    fontWeight: 'bold',
    fontSize: 8,
  },
  headerBoxText: {
    fontSize: 8,
  },
  folioTextBelow: {
    position: 'absolute',
    top: 90,  // Ajusta este valor según el alto del headerBox
    right: 35,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#001E2F',
  },
});
