type Mail = { to: string; subject: string; text: string };

export async function sendMail(msg: Mail) {
  if (process.env.SES_FROM) {
    console.log("[mail:ses-not-wired]", msg.subject, "to", msg.to);
    return;
  }
  console.log("\n--- EMAIL ---");
  console.log("To:", msg.to);
  console.log("Subject:", msg.subject);
  console.log(msg.text);
  console.log("-------------\n");
}

export async function orderEmails(opts: {
  customerEmail?: string | null;
  customerName: string;
  kitchenEmail?: string | null;
  orderId: string;
  pickup: string;
  lines: string;
  total: string;
}) {
  if (opts.customerEmail) {
    await sendMail({
      to: opts.customerEmail,
      subject: `Order received · 7 Biryani ${opts.orderId.slice(0, 8)}`,
      text: `Hi ${opts.customerName},\n\nWe received your pickup order.\n\n${opts.lines}\nTotal (before card fees): ${opts.total}\nPickup: ${opts.pickup}\n\nTrack: /orders/${opts.orderId}\n`,
    });
  }
  await sendMail({
    to: opts.kitchenEmail || "kitchen@localhost",
    subject: `New order ${opts.orderId.slice(0, 8)}`,
    text: `${opts.customerName}\n${opts.lines}\nPickup: ${opts.pickup}\n`,
  });
}
