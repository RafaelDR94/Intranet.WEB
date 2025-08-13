import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import HojaMembretada from '@/assets/images/Walpapers/HojaMembretada.png';
import { StaticImageData } from 'next/dist/shared/lib/image-external';
Font.register({ family: 'Izayoi', src: '/fonts/IzayoiMonospaced-nwoY.ttf' });
Font.register({ family: 'Mechanical', src: '/fonts/Mechanical-g5Y5.otf' });

// Define interfaces
export interface DataChartElement {
  label: string;
  text: string;
  fullWidth?: boolean;
}
export interface SingleElement {
  singletitle?: string;
  text: string;
  borderactive?: boolean;
}
export interface ImageElement {
  title: string;
  description?: string;
  urlimage: string;
  width?: string | number;
  height?: string | number;
}
export interface CheckElement {
  state: boolean;
  label?: string;
}
export interface SignatureElement {
  name: string;
  charge?: string;
  signature?: string;
}
export interface DataChart {
  title: string;
  data: DataChartElement[];
}
export interface Table {
  title: string;
  headers: string[];
  datatable: string[][];
  relation?: number[];
}
interface ImageList {
  title: string;
  pictures: ImageElement[];
}
interface CheckList {
  title: string;
  checks: CheckElement[];
}
interface SignatureChart {
  title: string;
  signatures: SignatureElement[];
}
export interface ListElement {
  title: string;
  items: string[];
}

export interface HeaderBox {
  docTitle: string;
  version: string;
  docType: string;
  docKey: string;
  creationDate?: string;
  lastVersionDate?: string;
}

// Se agrega la propiedad opcional "orientation" para definir la orientación de la página
export interface newDocument {
  title?: string;
  folio?: string;
  progress?: string;
  orientation?: 'vertical' | 'horizontal';
  headerBox?: HeaderBox;
  elements: (SignatureChart | DataChart | ImageList | Table | CheckList | SingleElement | ListElement)[];
}

export interface FullDocument {
  pages: newDocument[];
}


// Define los estilos
const styles = StyleSheet.create({
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

const RenderTable: React.FC<Table> = ({ title, headers, datatable, relation }) => {
  const totalSpace = 12;
  const defaultFlex = 1;
  const columnFlex = relation
    ? relation.map((rel) => (rel / relation.reduce((a, b) => a + b, 0)) * totalSpace)
    : Array(headers.length).fill(defaultFlex);



  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableHeaders}>{title}</Text>
      {/* Renderizar cabeceras */}
      <View style={styles.tableRow}>
        {headers.map((header, index) => (
          <Text key={index} style={[styles.tableCell, styles.headerCell, { flex: columnFlex[index] }]}>
            {header}
          </Text>
        ))}
      </View>
      {/* Renderizar filas */}
      {datatable.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {row.map((cell, cellIndex) => (
            <Text key={cellIndex} style={[styles.tableCell, { flex: columnFlex[cellIndex] }]}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const MyDocument: React.FC<{ data: FullDocument | null }> = ({ data }) => (
  <Document>
    {data?.pages.map((pageData, pageIndex) => {
      const pageSize = pageData.orientation === 'horizontal' ? [792, 612] : [612, 792];
      const hojaSrc = (HojaMembretada as StaticImageData).src;
      return (
        <Page key={pageIndex} style={styles.page} size={pageData.orientation === 'horizontal' ? [792, 612] : [612, 792]} wrap>
          <View style={styles.watermark}>
            <Image src={hojaSrc} style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: pageSize[0],
              height: pageSize[1]
            }} />
          </View>
          {pageData.headerBox ? (
            <>
              <View style={styles.headerBox}>
                {/* Fila 1: Título */}
                <View style={styles.headerBoxRowSingle}>
                  <Text style={styles.headerBoxTitle}>{pageData.headerBox.docTitle}</Text>
                </View>
                {/* Fila 2: Versión, Tipo y Clave en la misma línea */}
                <View style={styles.headerBoxRow}>
                  <Text style={styles.headerBoxText}>Versión: {pageData.headerBox.version}</Text>
                  <Text style={styles.headerBoxText}>Tipo: {pageData.headerBox.docType}</Text>
                  <Text style={styles.headerBoxText}>Clave: {pageData.headerBox.docKey}</Text>
                </View>
                {/* Fila 3: Fechas */}
                <View style={styles.headerBoxRow}>
                  <Text style={styles.headerBoxText}>Fecha: {pageData.headerBox.creationDate}</Text>
                  {pageData.headerBox.lastVersionDate&&<Text style={styles.headerBoxText}>Última versión: {pageData.headerBox.lastVersionDate}</Text>}
                </View>
              </View>
              {/* Mostrar el folio debajo del headerBox */}
              <Text style={styles.folioTextBelow}>{pageData.folio ? pageData.folio : ""}</Text>
              <Text style={styles.folioText}>{""}</Text>
            </>
          ) : (
            <Text style={styles.folioText}>{pageData.folio ? pageData.folio : ""}</Text>
          )}
          <Text style={styles.footer}>
            Calle Becerra 70-B Col. Tacubaya{'\n'}
            Alcaldía Miguel Hidalgo C.P. 11870{'\n'}
            Tel. (55) 5511 6508 • contacto@drsecurity.net{'\n'}
            www.drsecurity.net
          </Text>
          <Text style={styles.titleText}>{pageData.title}</Text>
          {pageData.progress && (
            <>
              <Text style={styles.progressText}>{"Progreso: " + pageData.progress + "%"}</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${pageData.progress}%` }]} />
              </View>
            </>
          )}
          <View style={styles.content}>
            {pageData.elements.map((element, index) => {
              if ('data' in element) {
                return (
                  <View key={index} style={styles.section}>
                    <Text style={styles.tableHeader}>{element.title}</Text>
                    <View style={styles.flexRow}>
                      {element.data.map((item, idx) => (
                        <View key={idx} style={item.fullWidth ? styles.fullWidthCell : styles.cell}>
                          <Text style={styles.labelText}>{item.label}:</Text>
                          <Text style={styles.text}>{item.text}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              } else if ('datatable' in element) {
                return (
                  <View key={index} style={styles.section}>
                    <RenderTable
                      title={element.title}
                      headers={element.headers}
                      datatable={element.datatable}
                    />
                  </View>
                );
              } else if ('text' in element) {
                return (
                  <View key={index} style={styles.section}>
                    {element.singletitle && <Text style={styles.tableHeader}>{element.singletitle}</Text>}
                    <View style={styles.flexRow}>
                      <Text style={styles.text}>{element.text}</Text>
                    </View>
                  </View>
                );
              } else if ('pictures' in element) {
                return (
                  <View key={index} style={styles.section}>
                    {element.pictures.length > 0 && (
                      <>
                        <Text style={styles.tableHeader}>{element.title}</Text>
                        <View style={styles.imageContainer}>
                          {element.pictures.map((picture, idx) => (
                            <View key={idx} style={{ ...styles.imageCard, width: picture.width || styles.imageCard.width }}>
                              <Text style={styles.imageTitle}>{picture.title}</Text>
                              <Image style={{ ...styles.imageStyle, width: picture.width || styles.imageStyle.width, height: picture.height || styles.imageStyle.height }} src={picture.urlimage} />
                              {picture.description && (
                                <Text style={styles.imageDescription}>{picture.description}</Text>
                              )}
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                  </View>
                );
              } else if ('checks' in element) {
                return (
                  <View key={index} style={styles.section}>
                    <Text style={styles.tableHeader}>{element.title}</Text>
                    <View style={styles.flexRow}>
                      {element.checks.map((check, idx) => (
                        <View key={idx} style={styles.cell}>
                          <Text style={styles.labelText}>
                            {check.state ? '[x]' : '[ ]'}
                          </Text>
                          {check.label && <Text style={styles.text}>{check.label}</Text>}
                        </View>
                      ))}
                    </View>
                  </View>
                );
              } else if ('signatures' in element) {
                const signatureCount = element.signatures.length;
                const signatureBoxWidth = signatureCount === 1 ? '100%' : signatureCount === 2 ? '48%' : '23%';
                return (
                  <View key={index} style={styles.section}>
                    <Text style={styles.tableHeader}>{element.title}</Text>
                    <View style={{ ...styles.signatureContainer, justifyContent: signatureCount === 1 ? 'center' : 'space-between' }}>
                      {element.signatures.map((signature, idx) => (
                        <View key={idx} style={{ ...styles.signatureBox, width: signatureBoxWidth, alignItems: 'center', justifyContent: 'center' }}>
                          {signature.signature && (
                            <Image style={styles.signatureImage} src={signature.signature} />
                          )}
                          <View style={styles.signatureLine} />
                          <Text style={styles.signatureName}>{signature.name}</Text>
                          {signature.charge && <Text style={styles.signatureCharge}>{signature.charge}</Text>}
                        </View>
                      ))}
                    </View>
                  </View>
                );
              } else if ('items' in element) { // Render ListElement
                return (
                  <View key={index} style={styles.section}>
                    {element.title && <Text style={styles.tableHeader}>{element.title}</Text>}
                    {element.items.map((item, idx) => (
                      <View key={idx} style={styles.listItemContainer}>
                        <Text style={styles.listBullet}>{'\u2022'}</Text>
                        <Text style={styles.listItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                );
              }
              return null;
            })}
          </View>
          {/* Agregamos el número de página en la esquina inferior derecha */}
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
        </Page>
      );
    })}
  </Document>
);

// Función para crear el PDF
export const CreatePDF = async (data: FullDocument | null, setPDF: (url: string) => void) => {
  const blob = await pdf(<MyDocument data={data} />).toBlob();
  setPDF(URL.createObjectURL(blob));
};
