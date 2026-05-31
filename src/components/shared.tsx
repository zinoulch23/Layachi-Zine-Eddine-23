// Shared UI Components
import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Check, AlertTriangle, AlertCircle, Star } from 'lucide-react';

export function GlassCard({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-surface rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function PrimaryButton({ children, onClick, type = 'button', disabled = false, className = '', fullWidth = false }: any) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn-primary px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-strong ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({ children, onClick, type = 'button', disabled = false, className = '', fullWidth = false }: any) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`border border-outline/20 text-on-surface px-6 py-3 rounded-full font-medium text-sm hover:bg-surface-high hover:border-outline/40 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function TertiaryButton({ children, onClick, className = '' }: any) {
  return (
    <button onClick={onClick} className={`text-primary hover:underline underline-offset-4 text-sm font-medium transition-all duration-150 ${className}`}>
      {children}
    </button>
  );
}

export function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) {
  const styles: Record<string, string> = {
    pending: 'bg-tertiary/15 text-tertiary border-tertiary/30',
    accepted: 'bg-primary/10 text-primary border-primary/25',
    rejected: 'bg-error/10 text-error border-error/20',
    completed: 'bg-primary/15 text-primary border-primary/30',
    delivered: 'bg-primary/10 text-primary border-primary/25',
    'in_progress': 'bg-secondary/15 text-secondary border-secondary/30',
    disputed: 'bg-error/10 text-error border-error/20',
    verified: 'bg-primary/10 text-primary',
    unverified: 'bg-surface-high text-on-surface-variant',
    open: 'bg-error/10 text-error border-error/20',
    resolved: 'bg-primary/15 text-primary border-primary/30',
    'in_review': 'bg-tertiary/15 text-tertiary border-tertiary/30',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium capitalize ${sizeClasses} ${styles[status] || styles.pending}`}>
      {status === 'completed' && <Check size={size === 'sm' ? 10 : 12} />}
      {status.replace('_', ' ')}
    </span>
  );
}

export function CuratorChip({ label, active = false, onClick, onRemove }: { label: string; active?: boolean; onClick?: () => void; onRemove?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
        active ? 'bg-primary text-on-primary' : 'bg-surface-high text-on-surface-variant hover:bg-surface-bright'
      }`}
    >
      {label}
      {onRemove && (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }} className="opacity-60 hover:opacity-100 cursor-pointer">
          <X size={14} />
        </span>
      )}
    </button>
  );
}

export function InputField({ label, type = 'text', placeholder, value, onChange, error, required = false, name, autoComplete }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-on-surface-variant">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-surface-highest rounded-lg px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-all duration-200 border-b-2 ${
          error ? 'border-error' : 'border-outline-variant/30 focus:border-primary'
        }`}
      />
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
}

export function TextArea({ label, placeholder, value, onChange, error, maxLength, rows = 4 }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-on-surface-variant">{label}</label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        className={`w-full bg-surface-highest rounded-lg px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-all duration-200 resize-y border-b-2 ${
          error ? 'border-error' : 'border-outline-variant/30 focus:border-primary'
        }`}
      />
      <div className="flex justify-between">
        {error && <p className="text-error text-xs">{error}</p>}
        {maxLength && <p className="text-on-surface-variant text-xs ml-auto">{value?.length || 0}/{maxLength}</p>}
      </div>
    </div>
  );
}

export function SearchBar({ placeholder = 'Search...', value, onChange, className = '' }: any) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-surface-container rounded-full pl-11 pr-4 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 text-sm"
      />
    </div>
  );
}

export function Avatar({ src, alt = '', size = 'md', fallback }: { src?: string; alt?: string; size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; fallback?: string }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12', xl: 'w-16 h-16', '2xl': 'w-24 h-24' };
  return (
    <div className={`${sizes[size]} rounded-full bg-surface-high flex items-center justify-center overflow-hidden flex-shrink-0`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-on-surface-variant font-medium text-sm">{fallback}</span>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, action }: { icon: any; title: string; message: string; action?: { label: string; to: string } }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <Icon size={64} className="text-on-surface-variant/30 mb-4" />
      <h3 className="text-on-surface font-semibold text-lg mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm max-w-[360px] mb-6">{message}</p>
      {action && (
        <Link to={action.to} className="btn-primary px-6 py-2.5 rounded-full text-sm font-semibold">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function StatCard({ icon: Icon, value, label, trend }: { icon: any; value: string; label: string; trend?: string }) {
  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        {trend && (
          <span className="text-primary text-xs font-medium bg-primary/10 px-2 py-0.5 rounded-full">{trend}</span>
        )}
      </div>
      <p className="text-on-surface text-2xl font-bold mb-1">{value}</p>
      <p className="text-on-surface-variant text-sm">{label}</p>
    </GlassCard>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 24 : size === 'lg' ? 64 : 40;
  return (
    <div className="flex items-center justify-center">
      <svg width={s} height={s} viewBox="0 0 40 40" className="animate-spin">
        <circle cx="20" cy="20" r="16" fill="none" stroke="#3E494A" strokeWidth="3" opacity="0.2" />
        <circle cx="20" cy="20" r="16" fill="none" stroke="#95EDF5" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="20" />
      </svg>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: any) {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative bg-surface-highest rounded-3xl shadow-modal p-6 lg:p-8 w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-on-surface font-semibold text-lg">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center hover:bg-surface-bright transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
}

export function StarRating({ rating, onRate, size = 'md' }: { rating: number; onRate?: (r: number) => void; size?: 'sm' | 'md' | 'lg' }) {
  const stars = [1, 2, 3, 4, 5];
  const s = size === 'sm' ? 14 : size === 'lg' ? 28 : 20;
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => onRate?.(star)}
          className={`${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            size={s}
            className={star <= rating ? 'text-primary fill-primary' : 'text-outline-variant'}
          />
        </button>
      ))}
    </div>
  );
}

export function Toast({ type = 'success', message, onClose }: { type?: 'success' | 'error' | 'warning'; message: string; onClose: () => void }) {
  const icons: Record<string, typeof Check> = { success: Check, error: AlertCircle, warning: AlertTriangle };
  const colors: Record<string, string> = { success: 'border-l-primary', error: 'border-l-error', warning: 'border-l-tertiary' };
  const Icon = icons[type];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-6 right-6 z-[200] bg-surface-high rounded-xl shadow-card-hover p-4 border-l-4 ${colors[type]} flex items-center gap-3 max-w-sm`}
    >
      <Icon size={18} className={type === 'success' ? 'text-primary' : type === 'error' ? 'text-error' : 'text-tertiary'} />
      <p className="text-on-surface text-sm flex-1">{message}</p>
      <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function GradientOrb({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px] pointer-events-none orb-drift ${className}`} />
  );
}
