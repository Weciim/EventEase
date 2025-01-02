import { auth } from "@clerk/nextjs";
import { getOrderByUser } from "@/lib/actions/order.actions";
import { getFurnituresByUser } from "@/lib/actions/furniture.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FurnitureItem } from "@/components/shared/FurnitureItem";
import { OrderAccordion } from "@/components/shared/OrderAccordion";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const orders = await getOrderByUser({ userId, page: 1 });
  const furnitures = await getFurnituresByUser(userId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders && orders.data.length > 0 ? (
              <OrderAccordion orders={orders.data} />
            ) : (
              <p className="text-gray-500">No orders found.</p>
            )}
            {orders && orders.totalPages > 1 && (
              <Button asChild className="mt-4">
                <Link href="/orders">View All Orders</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your Furnitures</CardTitle>
          </CardHeader>
          <CardContent>
            {furnitures && furnitures.length > 0 ? (
              <div className="space-y-4">
                {furnitures.map((furniture: any) => (
                  <FurnitureItem key={furniture._id} furniture={furniture} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No furnitures found.</p>
            )}
            <Button asChild className="mt-4">
              <Link href="/furnitures/new">Add New Furniture</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
