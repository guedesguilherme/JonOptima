import React, { useState, useEffect } from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2, X, Save, LogIn, Loader2, Cloud, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useResumeData } from '../hooks/useResumeData';

const ResumeForm = ({ register, control, errors, watch, handleSubmit, reset }) => {
    const { currentUser, loginWithGoogle } = useAuth();
    const { saveData, loadData, loading: saving } = useResumeData();
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

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

    const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
        control,
        name: "experience"
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: "education"
    });

    const { fields: skillsFields, append: appendSkills, remove: removeSkills } = useFieldArray({
        control,
        name: "skills"
    });

    const { fields: certFields, append: appendCerts, remove: removeCerts } = useFieldArray({
        control,
        name: "certifications"
    });

    const handleSave = async (data) => {
        await saveData(data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const inputClass = "w-full bg-[#112240] border border-slate-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-slate-200 rounded-md p-2 transition-colors";
    const labelClass = "block text-sm font-medium text-slate-300 mb-1";
    const sectionClass = "bg-[#112240]/50 p-6 rounded-xl border border-slate-700/50 mb-6 shadow-lg backdrop-blur-sm";
    const sectionTitleClass = "text-xl font-bold text-teal-400 mb-4 border-b border-slate-700 pb-2";
    const buttonClass = "flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors mt-2 font-medium";
    const deleteButtonClass = "text-red-400 hover:text-red-300 transition-colors p-2";

    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-slate-200">
            {/* User Bar */}
            <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg">
                {currentUser ? (
                    <div className="flex items-center gap-4 w-full justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-teal-400 font-medium">Welcome, {currentUser.displayName}</span>
                            {isSyncing ? (
                                <Cloud className="text-yellow-400 animate-pulse" size={20} />
                            ) : dataLoaded ? (
                                <div className="flex items-center gap-1 text-teal-400" title="Data Synced">
                                    <Cloud size={20} />
                                    <CheckCircle size={14} />
                                </div>
                            ) : (
                                <Cloud className="text-slate-500" size={20} title="No Data Synced" />
                            )}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit(handleSave)}
                            disabled={saving}
                            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-[#0A192F] px-6 py-2 rounded-md font-bold disabled:opacity-50 shadow-md transition-colors"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {saveSuccess ? "Saved!" : "Save Progress"}
                        </motion.button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 w-full justify-between">
                        <span className="text-slate-400">Sign in to save your progress</span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={loginWithGoogle}
                            className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded font-bold hover:bg-gray-100"
                        >
                            <LogIn size={18} /> Sign in with Google
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Document Style Selector */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Document Style</h2>
                <Controller
                    control={control}
                    name="font_style"
                    defaultValue="modern"
                    render={({ field: { onChange, value } }) => (
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onChange('modern')}
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${value === 'modern' ? 'bg-teal-500/20 border-teal-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${value === 'modern' ? 'bg-teal-500 text-[#0A192F]' : 'bg-slate-700 text-slate-400'}`}>
                                        <span style={{ fontFamily: 'Arial, sans-serif' }}>Aa</span>
                                    </div>
                                    <span className={`font-bold ${value === 'modern' ? 'text-teal-400' : 'text-slate-300'}`}>Sans-Serif (Arial)</span>
                                </div>
                                <p className="text-sm text-slate-400">Modern & Clean</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onChange('classic')}
                                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${value === 'classic' ? 'bg-teal-500/20 border-teal-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${value === 'classic' ? 'bg-teal-500 text-[#0A192F]' : 'bg-slate-700 text-slate-400'}`}>
                                        <span style={{ fontFamily: 'Times New Roman, serif' }}>Aa</span>
                                    </div>
                                    <span className={`font-bold ${value === 'classic' ? 'text-teal-400' : 'text-slate-300'}`}>Serif (Times)</span>
                                </div>
                                <p className="text-sm text-slate-400">Professional & Traditional</p>
                            </motion.div>
                        </div>
                    )}
                />
            </div>

            {/* Contact Info */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Full Name</label>
                        <input {...register("contact_info.name", { required: true })} className={inputClass} placeholder="John Doe" />
                    </div>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input {...register("contact_info.email", { required: true })} className={inputClass} placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className={labelClass}>Phone</label>
                        <input {...register("contact_info.phone", { required: true })} className={inputClass} placeholder="+1 234 567 890" />
                    </div>
                    <div>
                        <label className={labelClass}>LinkedIn</label>
                        <input {...register("contact_info.linkedin")} className={inputClass} placeholder="linkedin.com/in/johndoe" />
                    </div>
                    <div>
                        <label className={labelClass}>GitHub</label>
                        <input {...register("contact_info.github")} className={inputClass} placeholder="github.com/johndoe" />
                    </div>
                    <div>
                        <label className={labelClass}>Portfolio URL</label>
                        <input {...register("contact_info.portfolio_url")} className={inputClass} placeholder="johndoe.com" />
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Professional Summary</h2>
                <div>
                    <label className={labelClass}>Summary</label>
                    <textarea {...register("summary")} className={`${inputClass} h-32`} placeholder="Brief professional summary..." />
                </div>
            </div>

            {/* Experience */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Experience</h2>
                <AnimatePresence>
                    {experienceFields.map((field, index) => {
                        const isCurrent = watch(`experience.${index}.is_current`);
                        return (
                            <motion.div
                                key={field.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="mb-6 p-4 bg-slate-800/50 rounded border border-slate-700 relative"
                            >
                                <button type="button" onClick={() => removeExperience(index)} className={`absolute top-2 right-2 ${deleteButtonClass}`}>
                                    <Trash2 size={18} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={labelClass}>Company</label>
                                        <input {...register(`experience.${index}.company`, { required: true })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Role</label>
                                        <input {...register(`experience.${index}.role`, { required: true })} className={inputClass} />
                                    </div>

                                    {/* Date Logic */}
                                    <div>
                                        <label className={labelClass}>Start Date</label>
                                        <input type="month" {...register(`experience.${index}.start_date`, { required: true })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>End Date</label>
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
                                                <label htmlFor={`current-${index}`} className="text-sm text-slate-300 cursor-pointer select-none">Present</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Description (One point per line)</label>
                                        <textarea {...register(`experience.${index}.description_points`)} className={`${inputClass} h-24`} placeholder="- Led team of 5 developers&#10;- Improved performance by 50%" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => appendExperience({ company: '', role: '', start_date: '', end_date: '', is_current: false, description_points: '' })}
                    className={buttonClass}
                >
                    <Plus size={18} /> Add Job
                </motion.button>
            </div>

            {/* Education */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Education</h2>
                <AnimatePresence>
                    {educationFields.map((field, index) => (
                        <motion.div
                            key={field.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="mb-6 p-4 bg-slate-800/50 rounded border border-slate-700 relative"
                        >
                            <button type="button" onClick={() => removeEducation(index)} className={`absolute top-2 right-2 ${deleteButtonClass}`}>
                                <Trash2 size={18} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Institution</label>
                                    <input {...register(`education.${index}.institution`, { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Degree</label>
                                    <input {...register(`education.${index}.degree`, { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Year</label>
                                    <input {...register(`education.${index}.year`, { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Details (Optional)</label>
                                    <input {...register(`education.${index}.details`)} className={inputClass} placeholder="GPA, Honors, etc." />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Description (Optional)</label>
                                    <textarea
                                        {...register(`education.${index}.description`)}
                                        className={`${inputClass} h-20 italic`}
                                        placeholder="e.g., Thesis on AI, Relevant Coursework..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => appendEducation({ institution: '', degree: '', year: '', details: '', description: '' })}
                    className={buttonClass}
                >
                    <Plus size={18} /> Add Education
                </motion.button>
            </div>

            {/* Certifications */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Certifications</h2>
                <AnimatePresence>
                    {certFields.map((field, index) => (
                        <motion.div
                            key={field.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="mb-6 p-4 bg-slate-800/50 rounded border border-slate-700 relative"
                        >
                            <button type="button" onClick={() => removeCerts(index)} className={`absolute top-2 right-2 ${deleteButtonClass}`}>
                                <Trash2 size={18} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Certification Name</label>
                                    <input {...register(`certifications.${index}.name`, { required: true })} className={inputClass} placeholder="AWS Certified Solutions Architect" />
                                </div>
                                <div>
                                    <label className={labelClass}>Issuing Organization</label>
                                    <input {...register(`certifications.${index}.issuer`, { required: true })} className={inputClass} placeholder="Amazon Web Services" />
                                </div>
                                <div>
                                    <label className={labelClass}>Date Issued</label>
                                    <input type="month" {...register(`certifications.${index}.date`, { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Credential URL (Optional)</label>
                                    <input {...register(`certifications.${index}.url`)} className={inputClass} placeholder="https://..." />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => appendCerts({ name: '', issuer: '', date: '', url: '' })}
                    className={buttonClass}
                >
                    <Plus size={18} /> Add Certification
                </motion.button>
            </div>

            {/* Skills */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Skills</h2>
                <AnimatePresence>
                    {skillsFields.map((field, index) => (
                        <motion.div
                            key={field.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="mb-4 p-4 bg-slate-800/50 rounded border border-slate-700 relative"
                        >
                            <button type="button" onClick={() => removeSkills(index)} className={`absolute top-2 right-2 ${deleteButtonClass}`}>
                                <Trash2 size={18} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Category</label>
                                    <input {...register(`skills.${index}.category`, { required: true })} className={inputClass} placeholder="Languages, Frameworks, etc." />
                                </div>
                                <div>
                                    <label className={labelClass}>Items</label>
                                    <Controller
                                        control={control}
                                        name={`skills.${index}.items`}
                                        defaultValue={[]}
                                        render={({ field: { onChange, value } }) => {
                                            // Ensure value is an array
                                            const tags = Array.isArray(value) ? value : (typeof value === 'string' ? value.split(',').map(s => s.trim()).filter(Boolean) : []);

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
                                                        placeholder="Type & press Enter..."
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => appendSkills({ category: '', items: [] })}
                    className={buttonClass}
                >
                    <Plus size={18} /> Add Skill Category
                </motion.button>
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
                        Saved to Cloud!
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default ResumeForm;
