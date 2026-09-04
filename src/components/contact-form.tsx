"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const mountedAt = useRef<number | null>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  // Al reemplazar el formulario por la confirmación, el foco se perdería en el
  // body. Lo llevamos al encabezado para no dejar colgado a quien navega con teclado.
  useEffect(() => {
    if (state === "success") successHeading.current?.focus();
  }, [state]);

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
          elapsed: mountedAt.current === null ? undefined : Date.now() - mountedAt.current,
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "No pudimos enviar el mensaje.");
      }

      form.reset();
      setState("success");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No pudimos enviar el mensaje. Intentá nuevamente.",
      );
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="contact-form form-success" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <h3 ref={successHeading} tabIndex={-1}>Mensaje enviado.</h3>
        <p>Gracias por escribirnos. Te contactamos para conocer mejor tu proyecto.</p>
        <button
          type="button"
          className="text-link"
          onClick={() => {
            mountedAt.current = Date.now();
            setState("idle");
          }}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submitForm} noValidate={false}>
      <div className="form-row">
        <label>
          Tu nombre
          <input
            required
            autoComplete="name"
            name="name"
            minLength={2}
            maxLength={80}
            placeholder="Nombre y apellido"
          />
        </label>
        <label>
          Tu email
          <input
            required
            autoComplete="email"
            type="email"
            name="email"
            maxLength={254}
            placeholder="nombre@empresa.com"
          />
        </label>
      </div>
      <label>
        ¿En qué podemos ayudarte?
        <textarea
          required
          name="message"
          rows={5}
          minLength={20}
          maxLength={3000}
          placeholder="Contanos brevemente tu proyecto o el problema que querés resolver..."
        />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        Tu sitio web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {state === "error" && (
        <p className="form-error" role="alert">
          {error} También podés escribirnos directamente a{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      )}
      <button
        className="button button-light form-submit"
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Enviando…" : "Solicitar una conversación"}
        <span aria-hidden="true">↗</span>
      </button>
      <small>
        Usamos tus datos únicamente para responder a tu consulta. Consultá nuestra{" "}
        <Link href="/privacidad">política de privacidad</Link>.
      </small>
    </form>
  );
}
