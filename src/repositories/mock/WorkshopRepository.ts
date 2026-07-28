import { IWorkshopRepository } from "../interfaces";
import { Workshop } from "@/types/database";
import { MOCK_WORKSHOPS } from "../mockData";

const WORKSHOPS_STORAGE_KEY = "sientoops_workshops";

export class MockWorkshopRepository implements IWorkshopRepository {
  private getStored(): Workshop[] {
    if (typeof window === "undefined") return MOCK_WORKSHOPS;
    const stored = localStorage.getItem(WORKSHOPS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(WORKSHOPS_STORAGE_KEY, JSON.stringify(MOCK_WORKSHOPS));
      return MOCK_WORKSHOPS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return MOCK_WORKSHOPS;
    }
  }

  private save(workshops: Workshop[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(WORKSHOPS_STORAGE_KEY, JSON.stringify(workshops));
    }
  }

  async getAll(): Promise<Workshop[]> {
    return this.getStored();
  }

  async getById(id: string): Promise<Workshop | null> {
    const workshops = this.getStored();
    return workshops.find((w) => w.id === id) || null;
  }

  async create(data: Omit<Workshop, "id">): Promise<Workshop> {
    const workshops = this.getStored();
    const newWorkshop: Workshop = {
      ...data,
      id: `wks_${Date.now()}`,
    };
    const updated = [newWorkshop, ...workshops];
    this.save(updated);
    return newWorkshop;
  }

  async update(id: string, data: Partial<Workshop>): Promise<Workshop> {
    const workshops = this.getStored();
    let updatedWks: Workshop | null = null;
    const updated = workshops.map((w) => {
      if (w.id === id) {
        updatedWks = { ...w, ...data };
        return updatedWks;
      }
      return w;
    });
    this.save(updated);
    if (!updatedWks) throw new Error("Workshop not found");
    return updatedWks;
  }

  async delete(id: string): Promise<boolean> {
    const workshops = this.getStored();
    const updated = workshops.filter((w) => w.id !== id);
    this.save(updated);
    return true;
  }
}
