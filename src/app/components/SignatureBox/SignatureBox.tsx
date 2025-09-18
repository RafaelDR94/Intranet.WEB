import Image from 'next/image';
import React from 'react';

import { boxBase, captionTopstyle, captionBottomstyle, titleStyle, imageStyle } from './styles';

export type SignatureBoxProps = {
  /** Titulo que identifica a la persona o rol asociado a la firma. */
  title: string;
  /** URL o data URI de la imagen de la firma. Si no se provee se mostrar un marcador de 'sin firma'. */
  imageUrl?: string;
  /** Texto descriptivo que se muestra encima de la imagen (por ejemplo, cargo). */
  captionTop?: string;
  /** Texto descriptivo que se muestra debajo de la imagen (por ejemplo, fecha). */
  captionBottom?: string;
};

const SignatureBox: React.FC<SignatureBoxProps> = ({ title, imageUrl, captionTop, captionBottom }) => (
  <div className="space-y-2">
    <div className={boxBase}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, 400px"
          className={imageStyle}
        />
      ) : (
        <div className={captionTopstyle}>(sin firma)</div>
      )}
    </div>
    <div className="text-center">
      <div className={titleStyle}>{title}</div>
      {captionTop && <div className={captionTopstyle}>{captionTop}</div>}
      {captionBottom && <div className={captionBottomstyle}>{captionBottom}</div>}
    </div>
  </div>
);

export default SignatureBox;
