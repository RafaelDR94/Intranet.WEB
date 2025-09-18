'use client';

import React from 'react';

import { Button } from '@/app/components/Button/Button';
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout';
import Label from '@/app/components/Label/Label';
import type { LabelType } from '@/app/components/Label/types';
import type { ControlDetailPanelProps } from '../../types';
import PDFIcon from '@/assets/icons/Docs/page.svg';
import XMLIcon from '@/assets/icons/Docs/privacy policy.svg';

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').toLowerCase();
  if (normalized.includes('rechaz')) return 'rechazado';
  if (normalized.includes('proceso')) return 'en-proceso';
  if (normalized.includes('valid')) return 'valido';
  if (normalized.includes('pend')) return 'pendiente';
  if (normalized.includes('no deducible')) return 'prohibido';
  return normalized ? 'actualizado' : 'pendiente';
};

const ControlDetailPanel: React.FC<ControlDetailPanelProps> = ({
  open,
  onClose,
  selectedRow,
  detail,
  loading,
  formatDate,
  formatMoney,
}) => {
  const employeeName = detail?.employeename || selectedRow?.employeeName || '';
  const projectCode = detail?.project?.proyectkey || detail?.petty_cash_funds?.year_month || '';
  const status = selectedRow?.status;
  const applicationDate = detail?.application_date || selectedRow?.applicationDate;
  const provider = detail?.rfc_emisor || selectedRow?.provider || '';
  const concept = detail?.concept || selectedRow?.concept || '';
  const subtotal = detail?.subtotal ?? selectedRow?.subtotal;
  const iva = detail?.iva ?? selectedRow?.iva;
  const total = detail?.total ?? detail?.amount ?? selectedRow?.total;
  const voucherType = detail?.voucher_type || selectedRow?.voucherType || '';
  const uuid = detail?.uuid || '';
  const comments = detail?.comments || '';
  const xmlUrl = detail?.xml || '';
  const pdfUrl = detail?.pdf || '';
  const rfcReceptor = detail?.rfc_receptor || '';

  const conceptos = detail?.conceptos ?? [];

  return (
    <DetailsPanelLayout
      open={open}
      withinContainer
      onClose={onClose}
      leftLabel={employeeName ? `Colaborador: ${employeeName}` : undefined}
      rightLabel={projectCode ? `Proyecto: ${projectCode}` : undefined}
      renderActions={() =>
        status ? <Label type={statusToLabelType(status)} text={status.toUpperCase()} /> : null
      }
    >
      {selectedRow ? (
        <div className="space-y-4">
          {loading && <div className="text-gray-70 text-b4">Cargando detalle...</div>}

          {uuid ? <div className="text-gray-90 text-s1 font-semibold">{uuid}</div> : null}

          <div className="text-gray-90 text-b4 font-medium">
            FECHA DE APLICACIÓN:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">{formatDate(applicationDate) || '—'}</span>
          </div>

          <div className="text-gray-90 text-b4 font-medium">
            RFC EMISOR:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">{provider || '—'}</span>
          </div>

          {rfcReceptor ? (
            <div className="text-gray-90 text-b4 font-medium">
              RFC RECEPTOR:&nbsp;
              <span className="text-gray-90 text-b3 font-regular">{rfcReceptor}</span>
            </div>
          ) : null}

          <div className="text-gray-90 text-b4 font-medium">
            CONCEPTO:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">{concept || '—'}</span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-gray-70 text-c2 uppercase">Subtotal</div>
              <div className="text-gray-90 text-b3 font-medium">{formatMoney(subtotal)}</div>
            </div>
            <div>
              <div className="text-gray-70 text-c2 uppercase">IVA</div>
              <div className="text-gray-90 text-b3 font-medium">{formatMoney(iva)}</div>
            </div>
            <div>
              <div className="text-gray-70 text-c2 uppercase">Total</div>
              <div className="text-gray-90 text-b3 font-semibold">{formatMoney(total)}</div>
            </div>
            <div>
              <div className="text-gray-70 text-c2 uppercase">Tipo de vale</div>
              <div className="text-gray-90 text-b3 font-medium">{voucherType || '—'}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-90 text-b4 font-medium">Archivos enviados</span>
            <div className="flex items-center gap-2">
              <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                disabled={!xmlUrl}
                onClick={() => xmlUrl && window.open(xmlUrl, '_blank')}
              />
              <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                disabled={!pdfUrl}
                onClick={() => pdfUrl && window.open(pdfUrl, '_blank')}
              />
            </div>
          </div>

          {comments ? (
            <div className="space-y-1">
              <div className="text-gray-90 text-b4 font-medium">Comentarios</div>
              <p className="text-gray-50 text-b4 font-medium whitespace-pre-line">{comments}</p>
            </div>
          ) : null}

          {conceptos.length ? (
            <div className="space-y-3">
              <div className="text-gray-90 text-b4 font-medium">Conceptos</div>
              <div className="space-y-2">
                {conceptos.map((item) => (
                  <div
                    key={`${item.clave_sat}-${item.clavesat_description}`}
                    className="rounded-lg border border-gray-20 p-3"
                  >
                    <div className="text-gray-90 text-b4 font-semibold">{item.clavesat_description}</div>
                    <div className="text-gray-70 text-c2">{item.clave_sat}</div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-gray-90 text-b4">
                      <span>Cantidad: {item.cantidad}</span>
                      <span>Valor unitario: {formatMoney(item.valor_unitario)}</span>
                      <span className="col-span-2">Importe: {formatMoney(item.importe)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!loading && !detail && (
            <div className="text-gray-70 text-b3">No se encontró información adicional del vale.</div>
          )}
        </div>
      ) : (
        <div className="text-gray-70 text-b3">Selecciona un vale para ver su detalle.</div>
      )}
    </DetailsPanelLayout>
  );
};

export default ControlDetailPanel;
