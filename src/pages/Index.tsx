import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Phone, Mail, MapPin, Plus, Minus, X } from "lucide-react";
import { toast } from "sonner";

import heroCow from "@/assets/hero-cow.jpg";
import aboutBackground from "@/assets/about-background.jpg";
import productDairyBooster from "@/assets/product-dairy-booster.jpg";
import productOrganicFeed from "@/assets/product-organic-feed.jpg";
import productSilage from "@/assets/product-silage.jpg";
import productEnergyPellet from "@/assets/product-energy-pellet.jpg";
import contactBackground from "@/assets/contact-background.jpg";

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "Dairy Booster Mix", price: 450, unit: "10kg", image: productDairyBooster },
  { id: 2, name: "Organic Cattle Feed", price: 380, unit: "10kg", image: productOrganicFeed },
  { id: 3, name: "Green Silage Pack", price: 520, unit: "15kg", image: productSilage },
  { id: 4, name: "High Energy Pellet", price: 600, unit: "10kg", image: productEnergyPellet },
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0);
      return updatedCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const orderViaWhatsApp = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const orderDetails = cart
      .map((item) => `${item.name} (${item.unit}) x ${item.quantity} = ₹${item.price * item.quantity}`)
      .join("%0A");
    const total = getTotalPrice();
    const message = `Hello! I would like to order:%0A%0A${orderDetails}%0A%0ATotal: ₹${total}`;
    const whatsappUrl = `https://wa.me/919995454086?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Rinoof's Cattle Feeds</h1>
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4 flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">₹{item.price} per {item.unit}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 ml-auto"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold text-lg">Total:</span>
                          <span className="font-bold text-xl text-primary">₹{getTotalPrice()}</span>
                        </div>
                        <Button
                          variant="hero"
                          className="w-full"
                          onClick={orderViaWhatsApp}
                        >
                          <Phone className="mr-2 h-5 w-5" />
                          Order via WhatsApp
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroCow})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Fresh. Nutritious. Natural.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Premium cattle feeds for healthy, productive livestock
          </p>
          <Button
            variant="hero"
            size="lg"
            onClick={() => scrollToSection("products")}
            className="text-lg px-8 py-6"
          >
            Explore Products
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${aboutBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              About Rinoof's Cattle Feeds
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              At Rinoof's Cattle Feeds, we provide farm-fresh cattle feed designed to keep your livestock
              healthy and productive. Our products are crafted with natural ingredients, ensuring
              optimal nutrition for dairy cows and other farm animals. We believe in sustainable
              farming practices that benefit both animals and the environment.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-background nature-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Our Products</h2>
            <p className="text-lg text-muted-foreground">
              Premium quality feed for every nutritional need
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="overflow-hidden hover-lift animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">
                    ₹{product.price} per {product.unit}
                  </p>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${contactBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Get in Touch</h2>
            <p className="text-lg text-muted-foreground">We're here to help you with all your cattle feed needs</p>
          </div>
          <Card className="max-w-2xl mx-auto animate-on-scroll">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">WhatsApp / Phone</p>
                  <a
                    href="https://wa.me/919995454086"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +91 99954 54086
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-muted-foreground">Calicut, Kerala</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">contact@rinoofscattlefeeds.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Rinoof's Cattle Feeds | All Rights Reserved</p>
          <p className="text-sm mt-2 opacity-80">Fresh. Nutritious. Natural.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
