import { useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, Mail, Phone } from "lucide-react";
import { useSearchParams } from "../router.jsx";
import {
  catalogProducts,
  categories,
  companyContact,
  destinationCountries,
  localized,
} from "../data/siteData.js";

const copy = {
  en: {
    title: "Start with a clear brief.",
    intro:
      "Tell us the ingredient, application and destination. Your email client will open with a structured message addressed to Makendi.",
    name: "Your name",
    company: "Company",
    email: "Work email",
    phone: "Phone (optional)",
    category: "Ingredient family",
    product: "Specific format (optional)",
    destination: "Destination market",
    details: "Application, format, volume or documentation needs",
    selectCategory: "Select an ingredient family",
    selectProduct: "Select a published format",
    selectCategoryFirst: "Choose a family first",
    selectDestination: "Select a destination",
    consent:
      "I understand this form prepares an email inquiry and does not confirm availability, pricing or delivery.",
    submit: "Prepare email inquiry",
    direct: "Prefer a direct conversation?",
    validation: "Please complete the required fields and accept the inquiry notice.",
    prepared: "Your email draft is ready. If it did not open, email us directly.",
    privacy: "We do not store this form on the website. It opens your device’s email application.",
  },
  tr: {
    title: "Net bir taleple başlayın.",
    intro:
      "Ürünü, uygulamayı ve destinasyonu paylaşın. E-posta uygulamanız, Makendi’ye gönderilmek üzere yapılandırılmış bir mesajla açılır.",
    name: "Adınız",
    company: "Şirket",
    email: "İş e-postası",
    phone: "Telefon (isteğe bağlı)",
    category: "Ürün ailesi",
    product: "Belirli format (isteğe bağlı)",
    destination: "Hedef pazar",
    details: "Uygulama, format, hacim veya belge ihtiyaçları",
    selectCategory: "Bir ürün ailesi seçin",
    selectProduct: "Yayınlanmış bir format seçin",
    selectCategoryFirst: "Önce bir ürün ailesi seçin",
    selectDestination: "Bir destinasyon seçin",
    consent:
      "Bu formun bir e-posta talebi hazırladığını; uygunluk, fiyat veya teslimatı teyit etmediğini anlıyorum.",
    submit: "E-posta talebini hazırla",
    direct: "Doğrudan görüşmeyi mi tercih edersiniz?",
    validation: "Lütfen zorunlu alanları doldurun ve talep bildirimini kabul edin.",
    prepared: "E-posta taslağınız hazır. Açılmadıysa bize doğrudan e-posta gönderin.",
    privacy: "Bu form sitede saklanmaz; cihazınızdaki e-posta uygulamasını açar.",
  },
};

export default function InquiryForm({ language = "en" }) {
  const text = copy[language];
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialProduct = searchParams.get("product") || "";
  const initialDestination = searchParams.get("destination") || "";
  const validInitialCategory = categories.some(
    (category) => category.slug === initialCategory,
  )
    ? initialCategory
    : "";
  const validInitialProduct = catalogProducts.some(
    (product) =>
      product.categorySlug === validInitialCategory &&
      product.slug === initialProduct,
  )
    ? initialProduct
    : "";
  const [status, setStatus] = useState("");
  const [values, setValues] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    category: validInitialCategory,
    product: validInitialProduct,
    destination: destinationCountries.some((country) => country.iso === initialDestination)
      ? initialDestination
      : "",
    details: "",
    consent: false,
  });

  const categoryName = useMemo(
    () => localized(categories.find((item) => item.slug === values.category)?.name, language),
    [language, values.category],
  );
  const availableProducts = useMemo(
    () =>
      catalogProducts.filter(
        (product) => product.categorySlug === values.category,
      ),
    [values.category],
  );
  const productName = useMemo(
    () =>
      localized(
        catalogProducts.find(
          (product) =>
            product.categorySlug === values.category &&
            product.slug === values.product,
        )?.name,
        language,
      ),
    [language, values.category, values.product],
  );
  const destinationName = useMemo(
    () =>
      localized(
        destinationCountries.find((item) => item.iso === values.destination)?.name,
        language,
      ),
    [language, values.destination],
  );

  function update(event) {
    const { name, value, checked, type } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" ? { product: "" } : {}),
    }));
    if (status) setStatus("");
  }

  function submit(event) {
    event.preventDefault();
    if (
      !values.name.trim() ||
      !values.company.trim() ||
      !values.email.trim() ||
      !values.category ||
      !values.destination ||
      !values.details.trim() ||
      !values.consent
    ) {
      setStatus("error");
      return;
    }

    const subject =
      language === "tr"
        ? `Ürün talebi — ${productName || categoryName} / ${destinationName}`
        : `Ingredient inquiry — ${productName || categoryName} / ${destinationName}`;
    const body = [
      `${text.name}: ${values.name}`,
      `${text.company}: ${values.company}`,
      `${text.email}: ${values.email}`,
      `${text.phone}: ${values.phone || "—"}`,
      `${text.category}: ${categoryName}`,
      `${text.product}: ${productName || "—"}`,
      `${text.destination}: ${destinationName}`,
      "",
      `${text.details}:`,
      values.details,
    ].join("\n");

    setStatus("prepared");
    window.location.href = `mailto:${companyContact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="inquiry-layout">
      <div className="inquiry-intro reveal">
        <p className="eyebrow eyebrow--orange">01 / Brief</p>
        <h2>{text.title}</h2>
        <p className="lede">{text.intro}</p>
        <div className="direct-contact">
          <p>{text.direct}</p>
          <a href={`mailto:${companyContact.email}`}>
            <Mail size={18} />
            {companyContact.email}
          </a>
          <a href={`tel:${companyContact.phoneHref}`}>
            <Phone size={18} />
            {companyContact.phoneDisplay}
          </a>
        </div>
      </div>

      <form className="inquiry-form reveal" onSubmit={submit} noValidate>
        <div className="field-grid">
          <label>
            <span>{text.name} *</span>
            <input name="name" autoComplete="name" value={values.name} onChange={update} required />
          </label>
          <label>
            <span>{text.company} *</span>
            <input
              name="company"
              autoComplete="organization"
              value={values.company}
              onChange={update}
              required
            />
          </label>
          <label>
            <span>{text.email} *</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={update}
              required
            />
          </label>
          <label>
            <span>{text.phone}</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              value={values.phone}
              onChange={update}
            />
          </label>
          <label>
            <span>{text.category} *</span>
            <select name="category" value={values.category} onChange={update} required>
              <option value="">{text.selectCategory}</option>
              {categories.map((category) => (
                <option value={category.slug} key={category.slug}>
                  {localized(category.name, language)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{text.product}</span>
            <select
              name="product"
              value={values.product}
              onChange={update}
              disabled={!values.category}
            >
              <option value="">
                {values.category
                  ? text.selectProduct
                  : text.selectCategoryFirst}
              </option>
              {availableProducts.map((product) => (
                <option value={product.slug} key={product.slug}>
                  {localized(product.name, language)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{text.destination} *</span>
            <select name="destination" value={values.destination} onChange={update} required>
              <option value="">{text.selectDestination}</option>
              {destinationCountries.map((country) => (
                <option value={country.iso} key={country.iso}>
                  {localized(country.name, language)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          <span>{text.details} *</span>
          <textarea
            name="details"
            rows="6"
            value={values.details}
            onChange={update}
            required
          />
        </label>
        <label className="checkbox-field">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={update}
            required
          />
          <span aria-hidden="true">
            <CheckCircle2 size={17} />
          </span>
          <p>{text.consent}</p>
        </label>
        {status === "error" && (
          <p className="form-message form-message--error" role="alert">
            {text.validation}
          </p>
        )}
        {status === "prepared" && (
          <p className="form-message form-message--success" role="status">
            {text.prepared}
          </p>
        )}
        <div className="form-submit">
          <p>{text.privacy}</p>
          <button className="button button--orange" type="submit">
            {text.submit}
            <ArrowUpRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
