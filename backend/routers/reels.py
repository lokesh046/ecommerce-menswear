from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/reels", tags=["Instagram Reels"])

@router.get("", response_model=List[schemas.ReelResponse])
def get_reels(db: Session = Depends(get_db)):
    reels = db.query(models.Reel).order_by(models.Reel.id.desc()).all()
    return reels

@router.post("", response_model=schemas.ReelResponse, status_code=status.HTTP_201_CREATED)
def create_reel(reel_in: schemas.ReelCreate, db: Session = Depends(get_db)):
    db_reel = models.Reel(**reel_in.model_dump())
    db.add(db_reel)
    db.commit()
    db.refresh(db_reel)
    return db_reel

@router.delete("/{reel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reel(reel_id: int, db: Session = Depends(get_db)):
    db_reel = db.query(models.Reel).filter(models.Reel.id == reel_id).first()
    if not db_reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    db.delete(db_reel)
    db.commit()
    return None
