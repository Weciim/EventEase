"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateFurniture, deleteFurniture } from "@/lib/actions/furniture.action"
import { toast } from "react-hot-toast"

export function FurnitureItem({ furniture }) {
  const [quantity, setQuantity] = useState(furniture.stock)
  const [isExpired, setIsExpired] = useState(furniture.isExpired || false)

  const handleUpdateQuantity = async () => {
    try {
      await updateFurniture(furniture._id, { availableQuantity: quantity })
      toast.success("Quantity updated successfully")
    } catch (error) {
      toast.error("Failed to update quantity")
    }
  }

  const handleToggleExpired = async () => {
    try {
      const newIsExpired = !isExpired
      await updateFurniture(furniture._id, { isExpired: newIsExpired })
      setIsExpired(newIsExpired)
      toast.success(newIsExpired ? "Marked as expired" : "Marked as active")
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this furniture?")) {
      try {
        await deleteFurniture(furniture._id)
        toast.success("Furniture deleted successfully")
      } catch (error) {
        toast.error("Failed to delete furniture")
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{furniture.name}</h3>
      <p className="text-gray-600 mb-2">Price: ${furniture.price}</p>
      <p className="text-gray-600 mb-2">Category: {furniture.category}</p>
      <div className="flex items-center space-x-2 mb-2">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20"
        />
        <Button onClick={handleUpdateQuantity}>Update Quantity</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={handleToggleExpired} variant={isExpired ? "destructive" : "outline"}>
          {isExpired ? "Mark as Active" : "Mark as Expired"}
        </Button>
        <Button onClick={handleDelete} variant="destructive">Delete</Button>
      </div>
    </div>
  )
}

