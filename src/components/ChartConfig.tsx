
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ChartConfigProps {
  onColorsChange: (colors: { current: string; previous: string; goal: string }) => void;
  defaultColors: { current: string; previous: string; goal: string };
}

const predefinedColors = [
  "#8884d8", "#82ca9d", "#ff7300", "#0088FE", "#00C49F", 
  "#FFBB28", "#FF8042", "#FF6B8B", "#9B59B6", "#3498DB"
];

export function ChartConfig({ onColorsChange, defaultColors }: ChartConfigProps) {
  const [colors, setColors] = useState(defaultColors);

  const handleColorChange = (type: 'current' | 'previous' | 'goal', color: string) => {
    const newColors = { ...colors, [type]: color };
    setColors(newColors);
    onColorsChange(newColors);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span>Configurar Gráfico</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Configurações do Gráfico</h4>
            <p className="text-sm text-muted-foreground">
              Personalize as cores do gráfico
            </p>
          </div>
          
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="current">Mês Atual</Label>
              <div className="col-span-2 flex gap-2">
                <div 
                  className="h-6 w-6 rounded-full border cursor-pointer"
                  style={{ backgroundColor: colors.current }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = colors.current;
                    input.addEventListener('input', (e) => {
                      handleColorChange('current', (e.target as HTMLInputElement).value);
                    });
                    input.click();
                  }}
                />
                <div className="flex flex-wrap gap-1">
                  {predefinedColors.map((color) => (
                    <div
                      key={color}
                      className="h-4 w-4 rounded-full cursor-pointer border hover:scale-125 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange('current', color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="previous">Mês Anterior</Label>
              <div className="col-span-2 flex gap-2">
                <div 
                  className="h-6 w-6 rounded-full border cursor-pointer"
                  style={{ backgroundColor: colors.previous }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = colors.previous;
                    input.addEventListener('input', (e) => {
                      handleColorChange('previous', (e.target as HTMLInputElement).value);
                    });
                    input.click();
                  }}
                />
                <div className="flex flex-wrap gap-1">
                  {predefinedColors.map((color) => (
                    <div
                      key={color}
                      className="h-4 w-4 rounded-full cursor-pointer border hover:scale-125 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange('previous', color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="goal">Meta</Label>
              <div className="col-span-2 flex gap-2">
                <div 
                  className="h-6 w-6 rounded-full border cursor-pointer"
                  style={{ backgroundColor: colors.goal }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = colors.goal;
                    input.addEventListener('input', (e) => {
                      handleColorChange('goal', (e.target as HTMLInputElement).value);
                    });
                    input.click();
                  }}
                />
                <div className="flex flex-wrap gap-1">
                  {predefinedColors.map((color) => (
                    <div
                      key={color}
                      className="h-4 w-4 rounded-full cursor-pointer border hover:scale-125 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange('goal', color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
