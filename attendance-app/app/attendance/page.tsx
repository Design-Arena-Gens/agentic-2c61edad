'use client';

import { useState, useEffect } from 'react';
import QRScanner from '@/components/QRScanner';

interface StudentData {
  name: string;
  class: string;
  gender: 'Putra' | 'Putri';
}

export default function AttendancePage() {
  const [step, setStep] = useState<'scan' | 'form' | 'success'>('scan');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [status, setStatus] = useState<'Hadir' | 'Izin' | 'Sakit' | 'Alpha'>('Hadir');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default location if permission denied
          setLocation({ latitude: -6.2088, longitude: 106.8456 });
        }
      );
    }
  }, []);

  const handleQRScan = (decodedText: string) => {
    try {
      // Expected QR format: {"name":"Ahmad Rizki","class":"10A","gender":"Putra"}
      const data = JSON.parse(decodedText);
      setStudentData(data);
      setStep('form');
    } catch (err) {
      setError('QR Code tidak valid');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData || !location) return;

    setLoading(true);
    setError('');

    try {
      const now = new Date();
      const record = {
        name: studentData.name,
        class: studentData.class,
        gender: studentData.gender,
        status,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5),
        location,
      };

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });

      const result = await response.json();

      if (result.success) {
        setStep('success');
        setTimeout(() => {
          setStep('scan');
          setStudentData(null);
          setStatus('Hadir');
        }, 3000);
      } else {
        setError('Gagal menyimpan absensi');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan absensi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Absensi Siswa</h1>
            <p className="text-gray-600">Scan QR Code untuk absensi</p>
          </div>

          {step === 'scan' && (
            <div>
              <QRScanner
                onScanSuccess={handleQRScan}
                onScanError={(err) => setError(err)}
              />

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">📍 Lokasi Terdeteksi:</p>
                {location ? (
                  <p className="text-xs text-blue-600">
                    Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-xs text-blue-600">Mendeteksi lokasi...</p>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {step === 'form' && studentData && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">{studentData.name}</h2>
                <p className="text-blue-100">Kelas: {studentData.class}</p>
                <p className="text-blue-100">Jenis Kelamin: {studentData.gender}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Kehadiran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Hadir', 'Izin', 'Sakit', 'Alpha'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        status === s
                          ? 'bg-blue-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('scan');
                    setStudentData(null);
                    setError('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Absensi'}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Berhasil!</h2>
              <p className="text-gray-600">Absensi telah tersimpan</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
