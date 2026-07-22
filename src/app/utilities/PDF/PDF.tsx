import { pdf, Document, Page, Text, View, Image, Font } from '@react-pdf/renderer';
import { StaticImageData } from 'next/dist/shared/lib/image-external';
import React from 'react';

import { chunkPicturesIntoRows, getPictureDimensions } from './layout';
import { styles } from './styles';
import type { Table, FullDocument } from './types';

import HojaMembretada from '@/assets/images/Walpapers/HojaMembretada.jpg';
import HojaMembretadaDistrik from '@/assets/images/Walpapers/HOJA MEMBRETADA DISITREK.jpg'
import HojaMembretadaVip from '@/assets/images/Walpapers/Hoja Membretada_page-0001 (1).jpg'
Font.register({ family: 'Izayoi', src: '/fonts/IzayoiMonospaced-nwoY.ttf' });
Font.register({ family: 'Mechanical', src: '/fonts/Mechanical-g5Y5.otf' });

export type {
  DataChartElement,
  SingleElement,
  ImageElement,
  CheckElement,
  SignatureElement,
  DataChart,
  Table,
  ListElement,
  HeaderBox,
  newDocument,
  FullDocument,
} from './types';

// Component styles are defined in styles.ts

// Render helpers and components

/**
 * Renders a data table with optional column width ratios.
 * @param title Título de la tabla.
 * @param headers Cabeceras de columna.
 * @param datatable Filas de datos.
 * @param relation Proporción opcional para distribuir el ancho de columnas.
 */
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

/**
 * Documento interno usado para generar el PDF.
 * @param data Estructura completa del documento o `null`.
 */
export type MembretType = 'DR' | 'DISITREK' | 'VIP';

const MyDocument: React.FC<{ data: FullDocument | null, membret?: MembretType }> = ({ data, membret = "DR" }) => (
  <Document>
    {data?.pages.map((pageData, pageIndex) => {
      let hojaSrc = null;
      switch (membret) {
        case 'DR':
          hojaSrc = (HojaMembretada as StaticImageData).src;
          break;
        case 'DISITREK':
          hojaSrc = (HojaMembretadaDistrik as StaticImageData).src;
          break;
        case 'VIP':
          hojaSrc = (HojaMembretadaVip as StaticImageData).src;
          break;
        default:
          hojaSrc = (HojaMembretada as StaticImageData).src;
          break;
      }
      const pageSize = pageData.orientation === 'horizontal' ? [792, 612] : [612, 792];

      return (
        <Page key={pageIndex} style={styles.page} size={pageData.orientation === 'horizontal' ? [792, 612] : [612, 792]} wrap>
          <View style={styles.watermark}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
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
                  {pageData.headerBox.lastVersionDate && <Text style={styles.headerBoxText}>Última versión: {pageData.headerBox.lastVersionDate}</Text>}
                </View>
              </View>
              {/* Mostrar el folio debajo del headerBox */}
              <Text style={styles.folioTextBelow}>{pageData.folio ? pageData.folio : ""}</Text>
              <Text style={styles.folioText}>{""}</Text>
            </>
          ) : (
            <Text style={styles.folioText}>{pageData.folio ? pageData.folio : ""}</Text>
          )}
          
          {/* {membret != "DISITREK" && <Text style={styles.footer}>
            Calle Becerra 70-B Col. Tacubaya{'\n'}
            Alcaldía Miguel Hidalgo C.P. 11870{'\n'}
            Tel. (55) 5511 6508 • contacto@drsecurity.net{'\n'}
            www.drsecurity.net
          </Text>} */}

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
                const pictureRows = chunkPicturesIntoRows(element.pictures);
                return (
                  <View key={index} style={styles.section}>
                    {element.pictures.length > 0 && (
                      <>
                        <Text style={styles.tableHeader}>{element.title}</Text>
                        <View style={styles.imageContainer}>
                          {pictureRows.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.imageRow} wrap={false}>
                              {row.map((picture, pictureIndex) => {
                                const { width, height } = getPictureDimensions(picture);
                                return (
                                  <View key={`${rowIndex}-${pictureIndex}`} style={{ ...styles.imageCard, width }}>
                                    <Text style={styles.imageTitle}>{picture.title}</Text>
                                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                    <Image style={{ ...styles.imageStyle, width, height }} src={picture.urlimage} />
                                    {picture.description && (
                                      <Text style={styles.imageDescription}>{picture.description}</Text>
                                    )}
                                  </View>
                                );
                              })}
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
                            // eslint-disable-next-line jsx-a11y/alt-text
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

/**
 * Genera un PDF en memoria y proporciona la URL del blob resultante.
 * @param data Estructura completa del documento.
 * @param setPDF Callback que recibe la URL del blob generado.
 */
export const CreatePDF = async (data: FullDocument | null, setPDF: (url: string) => void, membret?: MembretType) => {
  const blob = await pdf(<MyDocument data={data} membret={membret} />).toBlob();
  setPDF(URL.createObjectURL(blob));
};

/**
 * Genera un PDF en memoria y retorna el Blob resultante.
 * @param data Estructura completa del documento.
 * @param membret Tipo de hoja membretada.
 */
export const CreatePDFBlob = async (
  data: FullDocument | null,
  membret?: MembretType,
): Promise<Blob> => {
  return await pdf(<MyDocument data={data} membret={membret} />).toBlob();
};
