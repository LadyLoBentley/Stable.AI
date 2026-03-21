from enum import Enum

class StockStatus(str, Enum):
    OUT_OF_STOCK = "out_of_stock"
    LOW_STOCK = "low_stock"
    IN_STOCK = "in_stock"

    @property
    def label(self) -> str:
        return {
            "out_of_stock": "Out of Stock",
            "low_stock": "Low Stock",
            "in_stock": "In Stock",
        }[self.value]
