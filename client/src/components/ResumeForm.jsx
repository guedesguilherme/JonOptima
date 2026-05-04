import React, { useState, useEffect } from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2, X, Save, LogIn, LogOut, Loader2, Cloud, CheckCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useResumeData } from '../hooks/useResumeData';

// Config por área: placeholders, labels e hints adaptativos
const areaConfig = {
    tecnologia: {
        summaryPlaceholder: 'Ex: Desenvolvedor Full Stack com 5 anos de experiência em React e Node.js, especializado em sistemas de alta performance e arquitetura escalável.',
        expDescPlaceholder: '- Desenvolveu API REST que reduziu latência em 40%\n- Liderou migração para microsserviços, reduzindo tempo de deploy em 60%',
        skillCategoryPlaceholder: 'Ex: Linguagens, Frameworks, DevOps...',
        skillItemsPlaceholder: 'Ex: JavaScript, Python, React...',
        skillsSuggestion: 'Sugestões: Linguagens · Frameworks · Banco de Dados · DevOps · Ferramentas',
        certNamePlaceholder: 'Ex: AWS Certified Solutions Architect',
        certIssuerPlaceholder: 'Ex: Amazon Web Services',
        showGithub: true,
        portfolioLabel: 'URL do Portfólio',
    },
    administracao: {
        summaryPlaceholder: 'Ex: Profissional de gestão com 8 anos de experiência em administração de equipes e processos, com foco em resultados, eficiência operacional e desenvolvimento de pessoas.',
        expDescPlaceholder: '- Gerenciou equipe de 15 pessoas, atingindo 98% das metas trimestrais\n- Reduziu custos operacionais em 23% via reestruturação de processos internos',
        skillCategoryPlaceholder: 'Ex: Gestão e Liderança, Ferramentas, Idiomas...',
        skillItemsPlaceholder: 'Ex: Liderança, Planejamento Estratégico, Excel Avançado...',
        skillsSuggestion: 'Sugestões: Gestão e Liderança · Ferramentas · Idiomas · Competências Comportamentais',
        certNamePlaceholder: 'Ex: PMP - Project Management Professional',
        certIssuerPlaceholder: 'Ex: Project Management Institute (PMI)',
        showGithub: false,
        portfolioLabel: 'Website / LinkedIn adicional',
    },
};

const AREAS = [
    { value: 'tecnologia',   label: 'Tecnologia',    available: true },
    { value: 'administracao', label: 'Administração', available: true },
    { value: 'financeiro',   label: 'Financeiro',    available: false },
    { value: 'marketing',    label: 'Marketing',     available: false },
    { value: 'juridico',     label: 'Jurídico',      available: false },
    { value: 'outro',        label: 'Outro',         available: false },
];

const ResumeForm = ({ register, control, errors, watch, handleSubmit, reset }) => {
    const { currentUser, loginWithGoogle, logout } = useAuth();
    const { saveData, loadData, loading: saving } = useResumeData();
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [collapsed, setCollapsed] = useState({
        contact: false, summary: false, experience: false,
        education: false, certifications: false, skills: false,
    });
    const toggle = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

    const area = watch('area') || 'tecnologia';
    const cfg = areaConfig[area] || areaConfig.tecnologia;

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                setIsSyncing(true);
                const data = await loadData();
                if (data) {
                    reset(data);
                    setDataLoaded(true);
                }
                setIsSyncing(false);
            }
        };
        fetchUserData();
    }, [currentUser, loadData, reset]);

    const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({ control, name: 'experience' });
    const { fields: educationFields,  append: appendEducation,  remove: removeEducation  } = useFieldArray({ control, name: 'education' });
    const { fields: skillsFields,     append: appendSkills,     remove: removeSkills     } = useFieldArray({ control, name: 'skills' });
    const { fields: certFields,       append: appendCerts,      remove: removeCerts      } = useFieldArray({ control, name: 'certifications' });

    const handleSave = async (data) => {
        await saveData(data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const inputClass = 'w-full bg-[#112240] border border-slate-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-slate-200 rounded-md p-2 transition-colors';
    const labelClass = 'block text-sm font-medium text-slate-300 mb-1';
    const sectionClass = 'bg-[#112240]/50 p-6 rounded-xl border border-slate-700/50 mb-6 shadow-lg backdrop-blur-sm';
    const sectionTitleClass = 'text-xl font-bold text-teal-400 border-b border-slate-700 pb-2';
    const SectionTitle = ({ sectionKey, children }) => (
        <button
            type="button"
            onClick={() => toggle(sectionKey)}
            className={`${sectionTitleClass} w-full flex items-center justify-between mb-4 hover:text-teal-300 transition-colors`}
        >
            <span>{children}</span>
            <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${collapsed[sectionKey] ? '-rotate-90' : ''}`}
            />
        </button>
    );
    const buttonClass = 'flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors mt-2 font-medium';
    const deleteButtonClass = 'text-red-400 hover:text-red-300 transition-colors p-2';

    const itemVariants = {
        hidden:  { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto' },
        exit:    { opacity: 0, height: 0 },
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-slate-200">

            {/* User Bar */}
            <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg">
                {currentUser ? (
                    <div className="flex items-center gap-4 w-full justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-teal-400 font-medium">Bem-vindo(a), {currentUser.displayName}</span>
                            {isSyncing ? (
                                <Cloud className="text-yellow-400 animate-pulse" size={20} />
                            ) : dataLoaded ? (
                                <div className="flex items-center gap-1 text-teal-400" title="Dados sincronizados">
                                    <Cloud size={20} /><CheckCircle size={14} />
                                </div>
                            ) : (
                                <Cloud className="text-slate-500" size={20} title="Sem dados sincronizados" />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit(handleSave)}
                                disabled={saving}
                                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-[#0A192F] px-6 py-2 rounded-md font-bold disabled:opacity-50 shadow-md transition-colors"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saveSuccess ? 'Salvo!' : 'Salvar Progresso'}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={logout}
                                title="Sair"
                                className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 border border-slate-600 hover:border-red-400/50 px-3 py-2 rounded-md transition-colors text-sm"
                            >
                                <LogOut size={16} /> Sair
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 w-full justify-between">
                        <span className="text-slate-400">Faça login para salvar seu progresso</span>
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={loginWithGoogle}
                            className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded font-bold hover:bg-gray-100"
                        >
                            <LogIn size={18} /> Entrar com Google
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Document Style Selector */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Estilo do Documento</h2>

                {/* Area Selector */}
                <div className="mb-6">
                    <label className={labelClass}>Área de Atuação</label>
                    <Controller
                        control={control}
                        name="area"
                        defaultValue="tecnologia"
                        render={({ field: { onChange, value } }) => (
                            <div className="grid grid-cols-3 gap-2">
                                {AREAS.map((a) => (
                                    <div
                                        key={a.value}
                                        onClick={() => a.available && onChange(a.value)}
                                        className={`
                                            relative p-3 rounded-lg border-2 text-sm font-medium text-center transition-all select-none
                                            ${a.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                            ${value === a.value
                                                ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                                                : a.available
                                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                                                    : 'bg-slate-800/50 border-slate-700/50 text-slate-500'}
                                        `}
                                    >
                                        {a.label}
                                        {!a.available && (
                                            <span className="absolute -top-2 -right-2 bg-slate-700 text-slate-400 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-slate-600 leading-tight">
                                                em breve
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </div>

                {/* Font Switcher */}
                <Controller
                    control={control}
                    name="font_style"
                    defaultValue="modern"
                    render={({ field: { onChange, value } }) => (
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => onChange('modern')}
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${value === 'modern' ? 'bg-teal-500/20 border-teal-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${value === 'modern' ? 'bg-teal-500 text-[#0A192F]' : 'bg-slate-700 text-slate-400'}`}>
                                        <span style={{ fontFamily: 'Arial, sans-serif' }}>Aa</span>
                                    </div>
                                    <span className={`font-bold ${value === 'modern' ? 'text-teal-400' : 'text-slate-300'}`}>Sans-Serif (Arial)</span>
                                </div>
                                <p className="text-sm text-slate-400">Moderno e Limpo</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => onChange('classic')}
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${value === 'classic' ? 'bg-teal-500/20 border-teal-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${value === 'classic' ? 'bg-teal-500 text-[#0A192F]' : 'bg-slate-700 text-slate-400'}`}>
                                        <span style={{ fontFamily: 'Times New Roman, serif' }}>Aa</span>
                                    </div>
                                    <span className={`font-bold ${value === 'classic' ? 'text-teal-400' : 'text-slate-300'}`}>Serif (Times)</span>
                                </div>
                                <p className="text-sm text-slate-400">Profissional e Tradicional</p>
                            </motion.div>
                        </div>
                    )}
                />
            </div>

            {/* Contact Info */}
            <div className={sectionClass}>
                <SectionTitle sectionKey="contact">Informações de Contato</SectionTitle>
                <AnimatePresence initial={false}>
                {!collapsed.contact && (
                <motion.div key="contact" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Nome Completo</label>
                        <input {...register('contact_info.name', { required: true })} className={inputClass} placeholder="João Silva" />
                    </div>
                    <div>
                        <label className={labelClass}>E-mail</label>
                        <input {...register('contact_info.email', { required: true })} className={inputClass} placeholder="joao@email.com" />
                    </div>
                    <div>
                        <label className={labelClass}>Telefone</label>
                        <input {...register('contact_info.phone', { required: true })} className={inputClass} placeholder="+55 11 99999-9999" />
                    </div>
                    <div>
                        <label className={labelClass}>LinkedIn</label>
                        <input {...register('contact_info.linkedin')} className={inputClass} placeholder="linkedin.com/in/joaosilva" />
                    </div>
                    {cfg.showGithub && (
                        <div>
                            <label className={labelClass}>GitHub</label>
                            <input {...register('contact_info.github')} className={inputClass} placeholder="github.com/joaosilva" />
                        </div>
                    )}
                    <div>
                        <label className={labelClass}>{cfg.portfolioLabel}</label>
                        <input {...register('contact_info.portfolio_url')} className={inputClass} placeholder="joaosilva.com" />
                    </div>
                </div>
                </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Summary */}
            <div className={sectionClass}>
                <SectionTitle sectionKey="summary">Resumo Profissional</SectionTitle>
                <AnimatePresence initial={false}>
                {!collapsed.summary && (
                <motion.div key="summary" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    <label className={labelClass}>Resumo</label>
                    <textarea
                        {...register('summary')}
                        className={`${inputClass} h-32`}
                        placeholder={cfg.summaryPlaceholder}
                    />
                </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Experience */}
            <div className={sectionClass}>
                <SectionTitle sectionKey="experience">Experiência</SectionTitle>
                <AnimatePresence initial={false}>
                {!collapsed.experience && (
                <motion.div key="experience-wrap" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <AnimatePresence>
                    {experienceFields.map((field, index) => {
                        const isCurrent = watch(`experience.${index}.is_current`);
                        return (
                            <motion.div
                                key={field.id}
                                variants={itemVariants} initial="hidden" animate="visible" exit="exit"
                                className="mb-6 p-4 bg-slate-800/50 rounded border border-slate-700 relative"
                            >
                                <button type="button" onClick={() => removeExperience(index)} className={`absolute top-2 right-2 ${deleteButtonClass}`}>
                                    <Trash2 size={18} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={labelClass}>Empresa</label>
                                        <input {...register(`experience.${index}.company`, { required: true })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Cargo</label>
                                        <input {...register(`experience.${index}.role`, { required: true })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Data de Início</label>
                                        <input type="month" {...register(`experience.${index}.start_date`, { required: true })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Data de Término</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="month"
                                                {...register(`experience.${index}.end_date`)}
                                                disabled={isCurrent}
                                                className={`${inputClass} ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            />
                                            <div className="flex items-center gap-2 min-w-[100px]">
                                                <input
                                                    type="checkbox"
                                                    {...register(`experience.${index}.is_current`)}
                                                    id={`current-${index}`}
                                                    className="w-4 h-4 accent-teal-500"
                                                />
                                                <label htmlFor={`current-${index}`} className="text-sm text-slate-300 cursor-pointer select-none">Atual</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Descrição (um ponto por linha)</label>
                                        <textarea
                                            {...register(`experience.${index}.description_points`)}
                                            className={`${inputClass} h-24`}
                                            placeholder={cfg.expDescPlaceholder}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => appendExperience({ company: '', role: '', start_date: '', end_date: '', is_current: false, description_points: '' })}
                    className={buttonClass}
                >
                    <Plus size={18} /> Adicionar Emprego
                </motion.button>
                </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Education */}
            <div className={sectionClass}>
                <SectionTitle sectionKey="education">Formação Acadêmica</SectionTitle>
                <AnimatePresence initial={false}>
                {!collapsed.education && (
                <motion.div key="education-wrap" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <AnimatePresence>
                    {educationFields.map((field, index) => (
                        <motion.div
                            key={field.id}
                            variants={itemVariants} initial="hidden" animate="visible" exit="exit"
                            className="mb-6 p-4 bg-slate-800/50 rounded border border-slate-700 relative"
                        >
                            <button type="button" onClick={() => removeEducation(index)} className={`absolute top-2 right-2 ${deleteButtonClass}`}>
                                <Trash2 size={18} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Instituição</label>
                                    <input {...register(`education.${index}.institution`, { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Curso / Grau</label>
                                    <input {...register(`education.${index}.degree`, { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Ano</label>
                                    <input {...register(`education.${index}.year`, { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Detalhes (Opcional)</label>
                                    <input {...register(`education.${index}.details`)} className={inputClass} placeholder="CRA, Honras, etc." />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Descrição (Opcional)</label>
                                    <textarea
                                        {...register(`education.${index}.description`)}
                                        className={`${inputClass} h-20 italic`}
                                        placeholder="ex: TCC sobre IA, Disciplinas Relevantes..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => appendEducation({ institution: '', degree: '', year: '', details: '', description: '' })}
                    className={buttonClass}
                >
                    <Plus size={18} /> Adicionar Formação
                </motion.button>
                </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Certifications */}
            <div className={sectionClass}>
                <SectionTitle sectionKey="certifications">Certificações</SectionTitle>
                <AnimatePresence initial={false}>
                {!collapsed.certifications && (
                <motion.div key="cert-wrap" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <AnimatePresence>
                    {certFields.map((field, index) => (
                        <motion.div
                            key={field.id}
                            variants={itemVariants} initial="hidden" animate="visible" exit="exit"
                            className="mb-6 p-4 bg-slate-800/50 rounded border border-slate-700 relative"
                        >
                            <button type="button" onClick={() => removeCerts(index)} className={`absolute top-2 right-2 ${deleteButtonClass}`}>
                                <Trash2 size={18} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Nome da Certificação</label>
                                    <input {...register(`certifications.${index}.name`, { required: true })} className={inputClass} placeholder={cfg.certNamePlaceholder} />
                                </div>
                                <div>
                                    <label className={labelClass}>Organização Emissora</label>
                                    <input {...register(`certifications.${index}.issuer`, { required: true })} className={inputClass} placeholder={cfg.certIssuerPlaceholder} />
                                </div>
                                <div>
                                    <label className={labelClass}>Data de Emissão</label>
                                    <input type="month" {...register(`certifications.${index}.date`, { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>URL da Credencial (Opcional)</label>
                                    <input {...register(`certifications.${index}.url`)} className={inputClass} placeholder="https://..." />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => appendCerts({ name: '', issuer: '', date: '', url: '' })}
                    className={buttonClass}
                >
                    <Plus size={18} /> Adicionar Certificação
                </motion.button>
                </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Skills */}
            <div className={sectionClass}>
                <SectionTitle sectionKey="skills">Habilidades</SectionTitle>
                <AnimatePresence initial={false}>
                {!collapsed.skills && (
                <motion.div key="skills-wrap" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                {cfg.skillsSuggestion && (
                    <p className="text-xs text-slate-500 mb-4">{cfg.skillsSuggestion}</p>
                )}
                <AnimatePresence>
                    {skillsFields.map((field, index) => (
                        <motion.div
                            key={field.id}
                            variants={itemVariants} initial="hidden" animate="visible" exit="exit"
                            className="mb-4 p-4 bg-slate-800/50 rounded border border-slate-700 relative"
                        >
                            <button type="button" onClick={() => removeSkills(index)} className={`absolute top-2 right-2 ${deleteButtonClass}`}>
                                <Trash2 size={18} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Categoria</label>
                                    <input
                                        {...register(`skills.${index}.category`, { required: true })}
                                        className={inputClass}
                                        placeholder={cfg.skillCategoryPlaceholder}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Itens</label>
                                    <Controller
                                        control={control}
                                        name={`skills.${index}.items`}
                                        defaultValue={[]}
                                        render={({ field: { onChange, value } }) => {
                                            const tags = Array.isArray(value)
                                                ? value
                                                : (typeof value === 'string' ? value.split(',').map(s => s.trim()).filter(Boolean) : []);

                                            const handleKeyDown = (e) => {
                                                if (e.key === 'Enter' || e.key === ',') {
                                                    e.preventDefault();
                                                    const newTag = e.target.value.trim();
                                                    if (newTag && !tags.includes(newTag)) {
                                                        onChange([...tags, newTag]);
                                                        e.target.value = '';
                                                    }
                                                }
                                            };

                                            const removeTag = (tagToRemove) => {
                                                onChange(tags.filter(tag => tag !== tagToRemove));
                                            };

                                            return (
                                                <div className="flex flex-wrap gap-2 p-2 bg-slate-800 border border-slate-700 rounded min-h-[42px]">
                                                    {tags.map((tag, i) => (
                                                        <span key={i} className="bg-teal-900/50 text-teal-300 px-2 py-1 rounded text-sm flex items-center gap-1 border border-teal-800">
                                                            {tag}
                                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-teal-100">
                                                                <X size={14} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                    <input
                                                        className="bg-transparent outline-none flex-1 min-w-[100px] text-white"
                                                        placeholder={cfg.skillItemsPlaceholder}
                                                        onKeyDown={handleKeyDown}
                                                    />
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => appendSkills({ category: '', items: [] })}
                    className={buttonClass}
                >
                    <Plus size={18} /> Adicionar Categoria
                </motion.button>
                </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {saveSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 bg-teal-500 text-[#0A192F] px-6 py-3 rounded-lg shadow-xl font-bold flex items-center gap-2 z-50"
                    >
                        <Save size={20} />
                        Salvo na nuvem!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeForm;
