"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
// import { formatDate } from "@/lib/utils"

export function OrderAccordion({ orders }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {orders.map((order, index) => (
        <AccordionItem key={order._id} value={`item-${index}`}>
          <AccordionTrigger>
            <div className="flex justify-between w-full">
              <span>Order {index + 1}</span>
              <span>${order.totalAmount}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {/* <p><strong>Date:</strong> {formatDate(order.createdAt)}</p> */}
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Items:</strong></p>
              <ul className="list-disc pl-5">
                {order.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.name} - Quantity: {item.quantity}, Price: ${item.price}
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

