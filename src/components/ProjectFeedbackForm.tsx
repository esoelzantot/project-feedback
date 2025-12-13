import { useState } from "react";
import { Plus, Star, Download, Trash2, Upload, X } from "lucide-react";

interface Review {
  id: number;
  pageTitle: string;
  comment: string;
  issueType: string;
  images: string[];
}

export default function ProjectFeedbackForm() {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, pageTitle: "", comment: "", issueType: "", images: [] },
  ]);
  const [generalFeedback, setGeneralFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const addReview = () => {
    setReviews([
      ...reviews,
      {
        id: Date.now(),
        pageTitle: "",
        comment: "",
        issueType: "",
        images: [],
      },
    ]);
  };

  const removeReview = (id: number) => {
    if (reviews.length > 1) {
      setReviews(reviews.filter((review) => review.id !== id));
    }
  };

  const updateReview = (id: number, field: string, value: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, [field]: value } : review
      )
    );
  };

  const handleImageUpload = (
    reviewId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReviews(
            reviews.map((review) =>
              review.id === reviewId
                ? {
                    ...review,
                    images: [...review.images, reader.result as string],
                  }
                : review
            )
          );
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (reviewId: number, imageIndex: number) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              images: review.images.filter((_, idx) => idx !== imageIndex),
            }
          : review
      )
    );
  };

  const exportToPDF = () => {
    // Validation
    if (!projectName || !projectType) {
      alert("⚠️ من فضلك أدخل اسم المشروع ونوعه أولاً");
      return;
    }

    // Create PDF content as HTML string
    const pdfContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; color: #000; direction: rtl;">
        
        <!-- Letterhead / Header -->
        <div style="border-bottom: 4px solid #1e40af; padding-bottom: 15px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h1 style="margin: 0; font-size: 28px; color: #1e40af; font-weight: 700;">تقرير تقييم المشروع</h1>
              <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">Project Testing & Feedback Report</p>
            </div>
            <div style="text-align: left;">
              <div style="font-size: 11px; color: #64748b; line-height: 1.6;">
                <div><strong>التاريخ:</strong> ${new Date().toLocaleDateString(
                  "ar-EG",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}</div>
                <div><strong>رقم المرجع:</strong> ${Date.now()
                  .toString()
                  .slice(-8)}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Summary Box -->
        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-right: 6px solid #1e40af; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
          <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1e40af; font-weight: 600;">ملخص المشروع</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; width: 30%; font-weight: 600; color: #475569;">اسم المشروع:</td>
              <td style="padding: 8px 0; color: #1e293b;">${projectName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">نوع المشروع:</td>
              <td style="padding: 8px 0; color: #1e293b;"><span style="background: #dbeafe; padding: 4px 12px; border-radius: 4px; font-weight: 500;">${projectType}</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">عدد الصفحات المُقيّمة:</td>
              <td style="padding: 8px 0; color: #1e293b;">${
                reviews.length
              } صفحة</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">التقييم الإجمالي:</td>
              <td style="padding: 8px 0; color: #1e293b;">
                <span style="color: #f59e0b; font-size: 18px; letter-spacing: 2px;">${"★".repeat(
                  rating
                )}${"☆".repeat(10 - rating)}</span>
                <span style="font-weight: 600; margin-right: 8px;">${rating}/10</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Detailed Reviews Section -->
        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">التقييم التفصيلي للصفحات</h2>
          
          ${reviews
            .map(
              (review, index) => `
            <div style="margin-bottom: 25px; page-break-inside: avoid;">
              <div style="background: #f1f5f9; padding: 12px 15px; border-right: 4px solid #3b82f6; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">
                  ${index + 1}. ${review.pageTitle || "صفحة غير محددة"}
                </h3>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <tr>
                  <td style="padding: 10px 15px; width: 25%; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">نوع المشكلة:</td>
                  <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0;">
                    <span style="background: ${
                      review.issueType === "Frontend"
                        ? "#dbeafe"
                        : review.issueType === "Backend"
                        ? "#fef3c7"
                        : review.issueType === "UI"
                        ? "#f3e8ff"
                        : "#f1f5f9"
                    }; padding: 4px 12px; border-radius: 4px; font-weight: 500;">
                      ${review.issueType || "غير محدد"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0; vertical-align: top;">الملاحظات:</td>
                  <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0; line-height: 1.6;">
                    ${review.comment || "لا توجد ملاحظات"}
                  </td>
                </tr>
              </table>

              ${
                review.images.length > 0
                  ? `
                <div style="margin-top: 15px;">
                  <div style="font-weight: 600; color: #475569; margin-bottom: 10px;">الصور المرفقة (${
                    review.images.length
                  }):</div>
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${review.images
                      .map(
                        (img, imgIdx) => `
                      <div style="border: 2px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                        <img src="${img}" alt="لقطة شاشة ${
                          imgIdx + 1
                        }" style="width: 100%; height: auto; display: block;" />
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              `
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Overall Feedback Section -->
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">الملاحظات العامة والتوصيات</h2>
          
          <div style="background: #fffbeb; border: 2px solid #fbbf24; border-radius: 4px; padding: 20px;">
            <p style="margin: 0; line-height: 1.8; color: #1e293b; white-space: pre-wrap;">
              ${generalFeedback || "لا توجد ملاحظات عامة"}
            </p>
          </div>
        </div>

        <!-- Footer / Signature Section -->
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
          <table style="width: 100%; margin-top: 30px;">
            <tr>
              <td style="width: 50%; text-align: center; padding: 20px 0;">
                <div style="border-top: 2px solid #1e293b; width: 200px; margin: 0 auto; padding-top: 8px;">
                  <div style="font-weight: 600; color: #475569;">توقيع المُقيّم</div>
                </div>
              </td>
              <td style="width: 50%; text-align: center; padding: 20px 0;">
                <div style="border-top: 2px solid #1e293b; width: 200px; margin: 0 auto; padding-top: 8px;">
                  <div style="font-weight: 600; color: #475569;">التاريخ</div>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Document Footer -->
        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          <p style="margin: 0;">هذا المستند تم إنشاؤه تلقائياً بواسطة نظام تقييم المشاريع الاحترافي</p>
          <p style="margin: 5px 0 0 0;">Professional Project Testing & Quality Assurance System</p>
        </div>
      </div>
    `;

    // Create a new window with the PDF content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>تقرير تقييم المشروع - ${projectName}</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 20px;
              background: #f5f5f5;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 0;
                background: white;
              }
              @page { 
                size: A4;
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          ${pdfContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            نموذج اختبار وتقييم المشاريع
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          <p className="text-slate-300 mt-4 text-lg">
            تقرير احترافي لضمان الجودة
          </p>
        </div>

        {/* Section 1: Project Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full ml-3"></span>
            معلومات المشروع
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                اسم المشروع
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="أدخل اسم المشروع..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                نوع المشروع
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Web", "Mobile", "UI"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setProjectType(type)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      projectType === type
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-white/5 text-slate-300 border border-white/20 hover:bg-white/10"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Page Reviews */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full ml-3"></span>
              تقييم الصفحات
            </h2>
            <button
              onClick={addReview}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              aria-label="إضافة تقييم جديد"
            >
              <Plus size={20} />
              إضافة تقييم
            </button>
          </div>

          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="bg-white/5 rounded-xl p-6 border border-white/10 relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-purple-300 font-bold text-lg">
                    تقييم #{index + 1}
                  </span>
                  {reviews.length > 1 && (
                    <button
                      onClick={() => removeReview(review.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                      aria-label="حذف التقييم"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      عنوان الصفحة
                    </label>
                    <input
                      type="text"
                      value={review.pageTitle}
                      onChange={(e) =>
                        updateReview(review.id, "pageTitle", e.target.value)
                      }
                      placeholder="مثال: صفحة تسجيل الدخول، لوحة التحكم..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      نوع المشكلة
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Frontend", "Backend", "UI"].map((type) => (
                        <button
                          key={type}
                          onClick={() =>
                            updateReview(review.id, "issueType", type)
                          }
                          className={`px-3 py-2.5 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                            review.issueType === type
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                              : "bg-white/5 text-slate-300 border border-white/20 hover:bg-white/10"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      التعليق التفصيلي
                    </label>
                    <textarea
                      value={review.comment}
                      onChange={(e) =>
                        updateReview(review.id, "comment", e.target.value)
                      }
                      placeholder="اكتب ملاحظاتك وتفاصيل المشكلة بالتفصيل..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      الصور المرفقة (اختياري)
                    </label>

                    <div className="space-y-3">
                      {/* Upload Button */}
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 hover:border-purple-400 transition-all">
                        <Upload size={20} className="text-purple-300" />
                        <span className="text-slate-300 font-medium">
                          رفع صور (لقطات شاشة)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(review.id, e)}
                          className="hidden"
                        />
                      </label>

                      {/* Display Uploaded Images */}
                      {review.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {review.images.map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative group rounded-lg overflow-hidden border border-white/20"
                            >
                              <img
                                src={img}
                                alt={`Screenshot ${imgIdx + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <button
                                onClick={() => removeImage(review.id, imgIdx)}
                                className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="حذف الصورة"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: General Feedback */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full ml-3"></span>
            التقييم العام
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                الملاحظات العامة
              </label>
              <textarea
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
                placeholder="شارك رأيك العام حول المشروع..."
                rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-3">
                التقييم (من 10)
              </label>
              <div className="flex items-center gap-2">
                {[...Array(10)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className="transition-all transform hover:scale-110"
                    aria-label={`تقييم ${i + 1} من 10`}
                    title={`تقييم ${i + 1} من 10`}
                  >
                    <Star
                      size={32}
                      className={`${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-600 hover:text-slate-500"
                      }`}
                    />
                  </button>
                ))}
                <span className="mr-4 text-2xl font-bold text-white">
                  {rating}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
          >
            <Download size={24} />
            تصدير إلى PDF
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>نظام احترافي لضمان الجودة</p>
        </div>
      </div>
    </div>
  );
}
