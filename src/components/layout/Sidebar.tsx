import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStorage } from '../../context/StorageContext';
import { formatBytes } from '../../services/storageService';
import { BapperidaLogo } from '../common/BapperidaLogo';
import { UserAvatar } from '../common/UserAvatar';
import { 
  FolderLock, 
  FolderKanban, 
  Share2, 
  Mail, 
  Users, 
  HardDrive, 
  RefreshCw, 
  Info,
  ChevronRight,
  X,
  Pencil,
  GitFork,
  Target,
  ShieldCheck,
  Download,
  CalendarCheck2,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export type ActiveNavTab = 'private' | 'public' | 'bidang' | 'surat' | 'iku' | 'tujuan-sasaran' | 'users' | 'security' | 'agenda';

interface SidebarProps {
  currentTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileModal?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onOpenProfileModal,
  isCollapsed = true,
  onToggleCollapse,
}) => {
  const { currentUser, isAdmin, isBidang, canAccessPublic, canAccessSurat } = useAuth();
  const { getStorageUsage, resetAllData, clearDemoData } = useStorage();

  if (!currentUser) return null;

  const storageInfo = getStorageUsage(isAdmin ? undefined : currentUser.id);
  const percentage = Math.min(
    100,
    Math.max(1, Math.round((storageInfo.usedBytes / storageInfo.totalBytes) * 100))
  );

  const handleNavClick = (tab: ActiveNavTab) => {
    onSelectTab(tab);
    onClose();
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'admin':
        return { label: 'Administrator', style: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
      case 'user':
        return { label: 'Staf Pengguna', style: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'bidang':
        return { label: 'User Bidang', style: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: currentUser.role, style: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-white text-slate-700 flex flex-col border-r border-slate-200/90 shadow-sm transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20 w-64' : 'w-64'}`}
      >
        {/* App Identification in Sidebar */}
        <div className={`p-3.5 border-b border-slate-100 flex items-center bg-gradient-to-b from-slate-50/50 to-white ${
          isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
        }`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              {/* Only the Logo is shown when collapsed */}
              <button
                type="button"
                onClick={onToggleCollapse}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 via-indigo-50 to-white border border-indigo-100/90 p-1 flex items-center justify-center shadow-2xs shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-400/40 hover:scale-105 transition-all group"
                title="Klik logo untuk memperluas sidebar"
              >
                <BapperidaLogo size="sm" className="w-10 h-10 group-hover:scale-110 transition-transform" />
              </button>
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  title="Perluas Sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-50 via-indigo-50 to-white border border-indigo-100/80 p-1 flex items-center justify-center shadow-2xs shrink-0">
                  <BapperidaLogo size="sm" className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>E-PMPED</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium -mt-0.5">
                    Bapperida Tanggamus
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Desktop Collapse Button */}
                {onToggleCollapse && (
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="hidden lg:flex text-slate-400 hover:text-indigo-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Sembunyikan Sidebar ke samping (Hanya tampilkan logo)"
                    aria-label="Sembunyikan Sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                )}

                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="lg:hidden text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                  aria-label="Tutup Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Mini Profile Card */}
        <div className={`pt-3 ${isCollapsed ? 'px-2 flex justify-center' : 'px-3'}`}>
          {isCollapsed ? (
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer group"
              title={`${currentUser.name} (${roleBadge.label}) · Klik untuk buka profil`}
            >
              <UserAvatar name={currentUser.name} role={currentUser.role} size="sm" />
            </button>
          ) : (
            <div 
              onClick={onOpenProfileModal}
              className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-2.5 hover:bg-slate-100/80 transition-colors cursor-pointer group"
              title={isBidang ? 'Lihat Profil Akun' : 'Ubah Profil & Kata Sandi Akun'}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <UserAvatar name={currentUser.name} role={currentUser.role} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 truncate leading-tight group-hover:text-indigo-600 transition-colors">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${roleBadge.style}`}>
                      {roleBadge.label}
                    </span>
                    {currentUser.department && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[70px]" title={currentUser.department}>
                        · {currentUser.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProfileModal?.();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0"
                title={isBidang ? 'Lihat Profil Akun' : 'Ubah Profil & Password'}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* User Role Notice Box for Bidang (only when expanded) */}
        {isBidang && !isCollapsed && (
          <div className="mx-3 mt-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs shadow-2xs">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-1">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Otorisasi Role Bidang:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800/90">
              Sebagai <strong>User Bidang</strong>, Anda berhak mengakses <strong>Menu Bidang</strong>, <strong>Menu IKU</strong>, dan <strong>Tujuan &amp; Sasaran RPJMD (Mode Pratinjau)</strong>.
            </p>
          </div>
        )}

        {/* Navigation Menu */}
        <div className={`flex-1 py-3 space-y-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {!isCollapsed ? (
            <div className="px-3 pb-2 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Ruang Penyimpanan
            </div>
          ) : (
            <div className="my-1.5 border-t border-slate-100 w-8 mx-auto" />
          )}

          {/* MENU 1: FILE SAYA (Private Cloud Storage) */}
          {!isBidang && (
            <button
              onClick={() => handleNavClick('private')}
              className={`w-full flex items-center transition-all group cursor-pointer ${
                isCollapsed
                  ? 'justify-center p-2.5 rounded-xl'
                  : 'justify-between px-3 py-2.5 rounded-xl text-xs font-medium'
              } ${
                currentTab === 'private'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              title="File Saya (Pribadi) - Ruang penyimpanan terisolasi & terenkripsi"
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                <FolderLock className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  currentTab === 'private' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                }`} />
                {!isCollapsed && <span className="whitespace-nowrap">File Saya (Pribadi)</span>}
              </div>
              {!isCollapsed && isAdmin && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                  currentTab === 'private'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                }`}>
                  Multi-Akun
                </span>
              )}
            </button>
          )}

          {/* MENU 2: DATA BIDANG PMPEPD */}
          {canAccessPublic && (
            <button
              onClick={() => handleNavClick('public')}
              className={`w-full flex items-center transition-all group cursor-pointer ${
                isCollapsed
                  ? 'justify-center p-2.5 rounded-xl'
                  : 'justify-between px-3 py-2.5 rounded-xl text-xs font-medium'
              } ${
                currentTab === 'public'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              title="Data Bidang PMPEPD - Repositori berkas bersama bidang PMPEPD"
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                <Share2 className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  currentTab === 'public' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                }`} />
                {!isCollapsed && <span className="whitespace-nowrap">Data Bidang PMPEPD</span>}
              </div>
              {!isCollapsed && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  currentTab === 'public'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  PMPEPD
                </span>
              )}
            </button>
          )}

          {/* MENU 3: MENU BIDANG */}
          <button
            onClick={() => handleNavClick('bidang')}
            className={`w-full flex items-center transition-all group cursor-pointer ${
              isCollapsed
                ? 'justify-center p-2.5 rounded-xl'
                : 'justify-between px-3 py-2.5 rounded-xl text-xs font-medium'
            } ${
              currentTab === 'bidang'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
            title="Menu Bidang - Berkas bidang teknis & kolaborasi"
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <FolderKanban className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                currentTab === 'bidang' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
              }`} />
              {!isCollapsed && <span className="whitespace-nowrap">Menu Bidang</span>}
            </div>
            {!isCollapsed && (
              isBidang ? (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                  currentTab === 'bidang'
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  Lihat &amp; Unduh
                </span>
              ) : (
                <ChevronRight className={`w-3.5 h-3.5 ${
                  currentTab === 'bidang' ? 'text-white/70' : 'text-slate-400 group-hover:text-slate-600'
                }`} />
              )
            )}
          </button>

          {/* SECTION 2: KEARSIPAN & SURAT */}
          {canAccessSurat && (
            <>
              {!isCollapsed ? (
                <div className="pt-4 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Kearsipan Dinas
                </div>
              ) : (
                <div className="my-2 border-t border-slate-100 w-8 mx-auto" />
              )}

              {/* MENU 4: MANAJEMEN SURAT (Masuk & Keluar) */}
              <button
                onClick={() => handleNavClick('surat')}
                className={`w-full flex items-center transition-all group cursor-pointer ${
                  isCollapsed
                    ? 'justify-center p-2.5 rounded-xl'
                    : 'justify-between px-3 py-2.5 rounded-xl text-xs font-medium'
                } ${
                  currentTab === 'surat'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                title="Manajemen Surat - Surat Masuk & Keluar"
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <Mail className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    currentTab === 'surat' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                  }`} />
                  {!isCollapsed && <span className="whitespace-nowrap">Manajemen Surat</span>}
                </div>
                {!isCollapsed && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    currentTab === 'surat'
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    Masuk &amp; Keluar
                  </span>
                )}
              </button>
            </>
          )}

          {/* SECTION: INDIKATOR KINERJA UTAMA (IKU) */}
          {!isCollapsed ? (
            <div className="pt-4 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Kinerja &amp; Perencanaan
            </div>
          ) : (
            <div className="my-2 border-t border-slate-100 w-8 mx-auto" />
          )}

          <button
            onClick={() => handleNavClick('iku')}
            className={`w-full flex items-center transition-all group cursor-pointer ${
              isCollapsed
                ? 'justify-center p-2.5 rounded-xl'
                : 'justify-between px-3 py-2.5 rounded-xl text-xs font-medium'
            } ${
              currentTab === 'iku'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/20 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
            title="Menu IKU (Kinerja) - Indikator Kinerja Utama"
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <GitFork className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                currentTab === 'iku' ? 'text-white' : 'text-emerald-600'
              }`} />
              {!isCollapsed && <span className="whitespace-nowrap">Menu IKU (Kinerja)</span>}
            </div>
            {!isCollapsed && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                currentTab === 'iku'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {isAdmin ? 'Admin' : 'Pratinjau'}
              </span>
            )}
          </button>

          {/* MENU: TUJUAN DAN SASARAN (RPJMD 5 TAHUNAN) */}
          <button
            onClick={() => handleNavClick('tujuan-sasaran')}
            className={`w-full flex items-center transition-all group cursor-pointer ${
              isCollapsed
                ? 'justify-center p-2.5 rounded-xl'
                : 'justify-between px-3 py-2.5 rounded-xl text-xs font-medium'
            } ${
              currentTab === 'tujuan-sasaran'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
            title="Tujuan & Sasaran RPJMD 5 Tahunan"
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Target className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                currentTab === 'tujuan-sasaran' ? 'text-white' : 'text-indigo-600'
              }`} />
              {!isCollapsed && <span className="whitespace-nowrap">Tujuan &amp; Sasaran</span>}
            </div>
            {!isCollapsed && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                currentTab === 'tujuan-sasaran'
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                5 Tahunan
              </span>
            )}
          </button>

          {/* SECTION: AGENDA & KOORDINASI WHATSAPP */}
          {!isBidang && (
            <>
              {!isCollapsed ? (
                <div className="pt-4 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Agenda &amp; Koordinasi
                </div>
              ) : (
                <div className="my-2 border-t border-slate-100 w-8 mx-auto" />
              )}

              <button
                onClick={() => handleNavClick('agenda')}
                className={`w-full flex items-center transition-all group cursor-pointer ${
                  isCollapsed
                    ? 'justify-center p-2.5 rounded-xl'
                    : 'justify-between px-3 py-2.5 rounded-xl text-xs font-medium'
                } ${
                  currentTab === 'agenda'
                    ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-sm shadow-amber-600/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                title="Agenda & Reminder WhatsApp PDF"
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <CalendarCheck2 className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    currentTab === 'agenda' ? 'text-white' : 'text-amber-600 group-hover:text-amber-700'
                  }`} />
                  {!isCollapsed && <span className="whitespace-nowrap">Agenda &amp; Reminder</span>}
                </div>
                {!isCollapsed && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    currentTab === 'agenda'
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    WhatsApp PDF
                  </span>
                )}
              </button>
            </>
          )}

          {/* SECTION 3: ADMINISTRASI (Admin Only) */}
          {isAdmin && (
            <>
              {!isCollapsed ? (
                <div className="pt-4 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pengawasan Admin
                </div>
              ) : (
                <div className="my-2 border-t border-slate-100 w-8 mx-auto" />
              )}

              <button
                onClick={() => handleNavClick('users')}
                className={`w-full flex items-center transition-all group cursor-pointer ${
                  isCollapsed
                    ? 'justify-center p-2.5 rounded-xl'
                    : 'justify-between px-3 py-2.5 rounded-xl text-xs font-medium'
                } ${
                  currentTab === 'users'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                title="Kelola Pengguna Sistem"
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <Users className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    currentTab === 'users' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                  }`} />
                  {!isCollapsed && <span className="whitespace-nowrap">Kelola Pengguna</span>}
                </div>
                {!isCollapsed && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    currentTab === 'users'
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    Otoritas
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('security')}
                className={`w-full flex items-center transition-all group cursor-pointer ${
                  isCollapsed
                    ? 'justify-center p-2.5 rounded-xl'
                    : 'justify-between px-3 py-2.5 rounded-xl text-xs font-medium'
                } ${
                  currentTab === 'security'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-sm shadow-rose-600/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                title="Log Akses & Keamanan Sistem"
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <ShieldCheck className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    currentTab === 'security' ? 'text-white' : 'text-rose-600 group-hover:text-rose-700'
                  }`} />
                  {!isCollapsed && <span className="whitespace-nowrap">Log Akses &amp; Keamanan</span>}
                </div>
                {!isCollapsed && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    currentTab === 'security'
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    Audit
                  </span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Sidebar Footer: Storage Meter & Utilities */}
        <div className={`border-t border-slate-200/80 bg-slate-50/70 ${isCollapsed ? 'p-2' : 'p-3.5'}`}>
          {isCollapsed ? (
            /* Collapsed Storage Meter */
            <div 
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs cursor-pointer group"
              title={`Kapasitas Penyimpanan: ${formatBytes(storageInfo.usedBytes)} dari ${formatBytes(storageInfo.totalBytes)} (${percentage}% terpakai - ${storageInfo.fileCount} berkas)`}
            >
              <HardDrive className={`w-4 h-4 transition-transform group-hover:scale-110 ${percentage > 85 ? 'text-amber-500' : 'text-indigo-600'}`} />
              <span className="text-[9px] font-mono font-bold text-slate-700 mt-1">{percentage}%</span>
            </div>
          ) : (
            /* Expanded Storage Meter */
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs mb-2.5">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isAdmin ? 'Kapasitas Global' : 'Kapasitas Akun'}</span>
                </span>
                <span className="font-mono font-semibold text-slate-800">{formatBytes(storageInfo.usedBytes)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    percentage > 85 ? 'bg-gradient-to-r from-amber-500 to-rose-600' : 'bg-gradient-to-r from-indigo-500 to-blue-600'
                  }`}
                  style={{ width: `${Math.max(4, percentage)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium mt-1.5">
                <span>{storageInfo.fileCount} berkas tersimpan</span>
                <span className="text-slate-800 font-semibold" title="Ukuran kuota disk penyimpanan instansi">
                  Batas {formatBytes(storageInfo.totalBytes)}
                </span>
              </div>
            </div>
          )}

          {isAdmin && (
            isCollapsed ? (
              /* Collapsed Admin Utilities */
              <div className="pt-2 border-t border-slate-200/80 flex flex-col items-center gap-1.5 mt-2">
                <a
                  href="/api/download-zip"
                  download="epmped-terbaru-lengkap.zip"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/80 transition-all cursor-pointer shadow-2xs"
                  title="Unduh File Update CasaOS (.ZIP)"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      '⚠️ KOSONGKAN DATA BAWAAN / DEMO?\n\nTindakan ini akan menghapus semua berkas arsip demo, surat dinas contoh, dan indikator demo agar sistem bersih siap digunakan untuk instansi.\n\nAkun Administrator Anda akan tetap tersimpan aman.\n\nLanjutkan mengosongkan data?'
                    );
                    if (confirmed) {
                      const success = await clearDemoData();
                      if (success) {
                        alert('✅ Seluruh data bawaan (demo) berhasil dikosongkan!');
                      } else {
                        alert('❌ Gagal mengosongkan data bawaan.');
                      }
                    }
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/80 transition-all cursor-pointer shadow-2xs"
                  title="Kosongkan Data Demo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset data ke kondisi awal (demo instansi)?')) {
                      resetAllData();
                    }
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                  title="Muat Ulang Data Bawaan"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Expanded Admin Utilities */
              <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                <a
                  href="/api/download-zip"
                  download="epmped-terbaru-lengkap.zip"
                  className="w-full py-1.5 px-2.5 text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 rounded-xl border border-indigo-200/90 transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99] cursor-pointer"
                  title="Unduh seluruh file proyek versi terbaru untuk dipindahkan ke CasaOS"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Unduh File Update CasaOS (.ZIP)</span>
                </a>

                <button
                  type="button"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      '⚠️ KOSONGKAN DATA BAWAAN / DEMO?\n\nTindakan ini akan menghapus semua berkas arsip demo, surat dinas contoh, dan indikator demo agar sistem bersih siap digunakan untuk instansi.\n\nAkun Administrator Anda akan tetap tersimpan aman.\n\nLanjutkan mengosongkan data?'
                    );
                    if (confirmed) {
                      const success = await clearDemoData();
                      if (success) {
                        alert('✅ Seluruh data bawaan (demo) berhasil dikosongkan!');
                      } else {
                        alert('❌ Gagal mengosongkan data bawaan.');
                      }
                    }
                  }}
                  className="w-full py-1.5 px-2.5 text-[11px] font-medium text-amber-700 hover:text-amber-800 bg-amber-50/80 hover:bg-amber-100/80 rounded-xl border border-amber-200/90 transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99] cursor-pointer"
                  title="Hapus semua berkas arsip dan surat dinas contoh untuk mulai dari lembaran kosong"
                >
                  <Trash2 className="w-3 h-3 text-amber-600" />
                  <span>Kosongkan Data Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset data ke kondisi awal (demo instansi)?')) {
                      resetAllData();
                    }
                  }}
                  className="w-full py-1.5 px-2.5 text-[11px] font-medium text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99] cursor-pointer"
                  title="Kembalikan file dan surat contoh bawaan jika diperlukan"
                >
                  <RefreshCw className="w-3 h-3 text-slate-400 group-hover:text-rose-500" />
                  <span>Muat Ulang Data Bawaan</span>
                </button>
              </div>
            )
          )}

          {/* Bottom Expand/Collapse Quick Toggle */}
          {onToggleCollapse && (
            <div className="pt-2 mt-1 border-t border-slate-200/60 flex justify-center">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="w-full py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors text-[11px] font-medium cursor-pointer"
                title={isCollapsed ? "Perluas Sidebar" : "Sembunyikan Sidebar ke Samping"}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-indigo-600" />
                ) : (
                  <>
                    <PanelLeftClose className="w-3.5 h-3.5" />
                    <span>Sembunyikan Menu</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
