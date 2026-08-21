"use client";

import { useEffect, useState } from "react";
import type { Service } from "@/lib/services";
import styles from "./display.module.css";

const POLL_INTERVAL_MS = 60_000;

// Placeholder promo content for screen 2's secondary panel. Replace with the
// shop's real Instagram handle and booking link/QR target when known.
const INSTAGRAM_HANDLE = "@bighitbarbershop";
const PROMO_TEXT = "Prices may vary with each barber.";

function formatPrice(service: Service): { label: string | null; amount: string } {
  return {
    label: service.isStartingPrice ? "Starting at" : null,
    amount: `$${service.price}`,
  };
}

function ServiceRow({ service }: { service: Service }) {
  const { label, amount } = formatPrice(service);
  return (
    <div className={styles.row}>
      <div className={styles.nameBlock}>
        <span className={styles.name}>{service.name}</span>
        {service.description ? (
          <span className={styles.description}>{service.description}</span>
        ) : null}
      </div>
      <div className={styles.leader} />
      {label ? <span className={styles.startingAt}>{label}</span> : null}
      <span className={styles.price}>{amount}</span>
    </div>
  );
}

function splitInHalf<T>(items: T[]): [T[], T[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

export default function DisplayClient({
  screen,
  initialServices,
}: {
  screen: number;
  initialServices: Service[];
}) {
  const [services, setServices] = useState(initialServices);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/services?screen=${screen}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.services)) {
          setServices(data.services);
        }
      } catch {
        // Network loss: keep showing the last known good data.
      }
    };

    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [screen]);

  if (screen === 2) {
    return (
      <div className={styles.screen}>
        <header className={styles.header}>
          <div className={styles.shopName}>Big Hit Barbershop</div>
          <div className={styles.tagline}>Service Menu</div>
          <div className={styles.headerRule} />
        </header>
        <div className={styles.body}>
          <div className={styles.list}>
            {services.map((service) => (
              <ServiceRow key={service.id} service={service} />
            ))}
          </div>
          <aside className={styles.secondaryPanel}>
            <div className={styles.panelHeading}>Follow Us</div>
            <div className={styles.panelBlock}>
              <div className={styles.panelLabel}>Instagram</div>
              <div className={styles.panelText}>{INSTAGRAM_HANDLE}</div>
            </div>
            <div className={styles.panelBlock}>
              <div className={styles.panelLabel}>Book Now</div>
              <div className={styles.qrBox}>QR Code</div>
            </div>
            <div className={styles.panelBlock}>
              <div className={styles.panelLabel}>Notice</div>
              <div className={styles.panelText}>{PROMO_TEXT}</div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  const [left, right] = splitInHalf(services);

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.shopName}>Big Hit Barbershop</div>
        <div className={styles.tagline}>Service Menu</div>
        <div className={styles.headerRule} />
      </header>
      <div className={styles.columns}>
        <div className={styles.column}>
          {left.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </div>
        <div className={styles.column}>
          {right.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}
