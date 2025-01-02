"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Minus, Plus, Trash2 } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useStateContext } from "@/components/context/CartContext";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";

const deliveryOptions = [
  { id: "pickup", label: "Pick up at our location" },
  { id: "deliver", label: "Deliver to my address (Contact us for a quote)" },
];

export default function CartPage() {
  const { cartItems, totalPrice, onRemove, toggleCartItemQuanitity } =
    useStateContext();

  const { user } = useUser();
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [reservationStart, setReservationStart] = useState(
    addDays(new Date(), 3)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [reservationEnd, setReservationEnd] = useState(addDays(new Date(), 3));
  const [subtotal, setSubtotal] = useState(0);

  const reservationDays = Math.max(
    differenceInDays(reservationEnd, reservationStart) + 1,
    1
  );

  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity * reservationDays,
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems, reservationDays]);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    if (!reservationStart || !reservationEnd) {
      toast.error("Please select reservation dates");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsLoading(true);

      const formattedCartItems = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch("/api/webhook/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: formattedCartItems,
          startDate: reservationStart.toISOString(),
          endDate: reservationEnd.toISOString(),
          deliveryOption,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.sessionUrl;
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(
        error.message || "Something went wrong with the payment process"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      const action =
        newQuantity > cartItems.find((item) => item._id === id).quantity
          ? "inc"
          : "dec";
      toggleCartItemQuanitity(id, action);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Your cart is empty
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between py-4 border-b last:border-b-0"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${item.price} per day
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, "dec")
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item._id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, "inc")
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => onRemove(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div>
                  <Label>Reservation Period</Label>
                  <div className="flex space-x-2 mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !reservationStart && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {reservationStart ? (
                            format(reservationStart, "PPP")
                          ) : (
                            <span>Start date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={reservationStart}
                          onSelect={setReservationStart}
                          disabled={(date) => date < addDays(new Date(), 2)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !reservationEnd && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {reservationEnd ? (
                            format(reservationEnd, "PPP")
                          ) : (
                            <span>End date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={reservationEnd}
                          onSelect={setReservationEnd}
                          disabled={(date) =>
                            date < (reservationStart || addDays(new Date(), 3))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {reservationDays > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Duration: {reservationDays} day(s)
                    </p>
                  )}
                </div>
                <div>
                  <Label>Delivery Options</Label>
                  <RadioGroup
                    value={deliveryOption}
                    onValueChange={setDeliveryOption}
                    className="mt-2"
                  >
                    {deliveryOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={cartItems.length === 0 || isLoading}
                  onClick={handleCheckout}
                >
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
